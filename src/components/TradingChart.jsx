import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function TradingChart({ symbol, currentPrice, history, isUp, timeframe = '1H' }) {
    const [series, setSeries] = useState([{ name: 'Price', data: [] }]);
    const [historyPrefix, setHistoryPrefix] = useState([]);
    const [isPrefixGenerated, setIsPrefixGenerated] = useState(false);

    // Reset when symbol or timeframe changes
    useEffect(() => {
        setIsPrefixGenerated(false);
        setSeries([{ name: 'Price', data: [] }]);
    }, [symbol, timeframe]);

    // Generate distinct historical shapes
    useEffect(() => {
        if (isPrefixGenerated) return;
        if (currentPrice === undefined && (!history || history.length === 0)) return;
        
        const baseP = currentPrice || (history && history[0]);
        if (baseP === undefined) return;

        const prefix = [];
        const now = new Date().getTime();
        let p = baseP;
        
        const liveDataStart = now - (history ? history.length * 5000 : 0);
        
        if (timeframe === '1H') {
            for(let i=1; i<=30; i++) {
                p = p / (1 + (Math.sin(i * 2.5) * 0.002) + (Math.cos(i * 4) * 0.001));
                prefix.unshift([liveDataStart - (i * 120000), p]); 
            }
        } else if (timeframe === '1D') {
            for(let i=1; i<=40; i++) {
                p = p / (1 + (Math.sin(i * 0.8) * 0.008) + (Math.cos(i * 1.5) * 0.005));
                prefix.unshift([liveDataStart - (i * 2160000), p]); 
            }
        } else if (timeframe === '1W') {
            for(let i=1; i<=50; i++) {
                p = p / (1 + (Math.sin(i * 0.3) * 0.02) + (Math.cos(i * 0.8) * 0.015));
                prefix.unshift([liveDataStart - (i * 12096000), p]); 
            }
        }
        
        setHistoryPrefix(prefix);
        setIsPrefixGenerated(true);
    }, [symbol, timeframe, currentPrice, history, isPrefixGenerated]);

    // Initialize full data (Prefix + Live History)
    useEffect(() => {
        if (isPrefixGenerated) {
            const now = new Date().getTime();
            const interval = 5000; 
            
            let liveData = [];
            if (history && history.length > 0) {
                liveData = history.map((price, i) => {
                    const time = now - (history.length - 1 - i) * interval;
                    return [time, price];
                });
            } else if (currentPrice !== undefined) {
                liveData = [[now, currentPrice]];
            }
            
            // Only set if we don't already have live data running
            if (liveData.length > 0) {
                setSeries(prev => {
                    if (prev[0].data.length <= historyPrefix.length) {
                        return [{ name: 'Price', data: [...historyPrefix, ...liveData] }];
                    }
                    return prev;
                });
            }
        }
    }, [history, currentPrice, historyPrefix, isPrefixGenerated]);

    // Live update
    useEffect(() => {
        if (currentPrice !== undefined && series[0].data.length > 0) {
            setSeries(prev => {
                const data = [...prev[0].data];
                const now = new Date().getTime();
                
                const lastPoint = data[data.length - 1];
                if (now - lastPoint[0] < 1000) {
                    data[data.length - 1] = [lastPoint[0], currentPrice];
                } else {
                    data.push([now, currentPrice]);
                }
                
                if (data.length > 150) {
                    data.shift();
                }
                
                return [{ name: 'Price', data }];
            });
        }
    }, [currentPrice]);

    const seriesColor = isUp ? '#10B981' : '#F43F5E';
    
    let xFormat = 'HH:mm:ss';
    if (timeframe === '1D') xFormat = 'dd MMM HH:mm';
    if (timeframe === '1W') xFormat = 'dd MMM';

    const options = {
        chart: {
            type: 'area',
            height: '100%',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000
                }
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            background: 'transparent',
            sparkline: {
                enabled: false
            }
        },
        colors: [seriesColor],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.0,
                stops: [0, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#A1A1AA',
                    fontFamily: 'Inter, sans-serif'
                },
                datetimeUTC: false,
                format: xFormat
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#A1A1AA',
                    fontFamily: 'Inter, sans-serif'
                },
                formatter: (value) => {
                    if (value >= 1000) return value.toFixed(2);
                    return value.toFixed(4);
                }
            },
        },
        grid: {
            borderColor: 'rgba(255, 255, 255, 0.05)',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            },
            padding: {
                left: 10,
                right: 10,
                top: 0,
                bottom: 0
            }
        },
        theme: {
            mode: 'dark'
        },
        tooltip: {
            theme: 'dark',
            x: {
                format: xFormat
            },
            y: {
                formatter: (value) => '$' + value.toFixed(4)
            },
            style: {
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif'
            },
            marker: {
                show: false
            }
        }
    };

    return (
        <div className="w-full h-full relative" style={{ minHeight: '100%' }}>
            <div className="absolute inset-0 w-full h-full pt-4 pr-2">
                {series[0].data.length > 0 ? (
                    <ReactApexChart 
                        options={options} 
                        series={series} 
                        type="area" 
                        height="100%" 
                        width="100%" 
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-500 text-sm font-semibold animate-pulse">
                        Synchronizing Market Data...
                    </div>
                )}
            </div>
            {/* Ambient Background Glow for Chart */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[rgba(16,185,129,0.03)] rounded-full blur-[80px] pointer-events-none" />
        </div>
    );
}
