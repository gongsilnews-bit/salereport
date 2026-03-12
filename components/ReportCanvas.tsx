
import React, { forwardRef } from 'react';
import { ReportState } from '../types';
import { 
    MapPinIcon, 
    HomeIcon, 
    BuildingOfficeIcon, 
    ChartBarIcon, 
    WrenchIcon,
    BoltIcon,
    ArrowTrendingUpIcon,
    CurrencyDollarIcon,
    LightBulbIcon,
    ClipboardDocumentCheckIcon,
    PaintBrushIcon,
    SparklesIcon,
    UserGroupIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';

interface ReportCanvasProps {
  data: ReportState;
  printPages: boolean[];
}

const ReportCanvas = forwardRef<HTMLDivElement, ReportCanvasProps>(({ data, printPages }, ref) => {
  const { info, currentPage, colorTheme, layoutTheme } = data;
  
  // A4 Landscape fixed values in mm
  const A4_WIDTH_MM = 297;
  const A4_HEIGHT_MM = 210;
  
  const themeStyles: any = {
    modern: { font: 'font-sans', radius: 'rounded-xl', border: 'border-slate-100' },
    luxury: { font: 'font-serif', radius: 'rounded-none', border: 'border-gold-200' },
    natural: { font: 'font-sans', radius: 'rounded-[2rem]', border: 'border-green-100' },
    bold: { font: 'font-black', radius: 'rounded-sm', border: 'border-slate-900' },
    'high-end': { font: 'font-sans', radius: 'rounded-lg', border: 'border-white/10' }
  };

  const currentStyle = themeStyles[layoutTheme] || themeStyles.modern;

  const getIcon = (iconName: string) => {
    const iconClass = `w-8 h-8 ${layoutTheme === 'luxury' ? 'text-gold-600' : ''}`;
    switch(iconName) {
        case 'building': return <BuildingOfficeIcon className={iconClass} />;
        case 'home': return <HomeIcon className={iconClass} />;
        case 'chart': return <ChartBarIcon className={iconClass} />;
        case 'crane': return <WrenchIcon className={iconClass} />;
        case 'trend': return <ArrowTrendingUpIcon className={iconClass} />;
        case 'coin': return <CurrencyDollarIcon className={iconClass} />;
        case 'idea': return <LightBulbIcon className={iconClass} />;
        case 'check': return <ClipboardDocumentCheckIcon className={iconClass} />;
        case 'paint': return <PaintBrushIcon className={iconClass} />;
        case 'sparkle': return <SparklesIcon className={iconClass} />;
        case 'users': return <UserGroupIcon className={iconClass} />;
        case 'bank': return <BanknotesIcon className={iconClass} />;
        default: return <BoltIcon className={iconClass} />;
    }
}

  const PageHeader = ({ pageNum, title, subTitle, tag }: { pageNum: string, title: string, subTitle: string, tag: string }) => (
    <div 
        className={`${currentStyle.font} h-[130px] px-10 flex justify-between items-end relative overflow-hidden shrink-0 text-white`}
        style={{ backgroundColor: colorTheme.secondary || '#0f172a' }}
    >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -rotate-45 translate-x-32 -translate-y-32"></div>
        <div className="relative z-10 pb-5">
            <div className="flex items-center gap-2 mb-2">
                <span 
                    className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter"
                    style={{ backgroundColor: colorTheme.primary, color: '#fff' }}
                >{tag}</span>
            </div>
            <h2 className={`text-4xl font-black tracking-tight mb-1 ${layoutTheme === 'luxury' ? 'font-serif italic' : ''}`}>{title}</h2>
            <p className="text-white/60 italic text-sm">{subTitle}</p>
        </div>
        <div className="relative z-10 border-l border-white/20 pl-8 h-10 mb-5 flex flex-col justify-center text-right">
            <span className="text-white font-black text-lg tracking-widest leading-none uppercase">
                {pageNum === '02' ? 'FOR SALE' : pageNum === '03' ? 'ASSET GALLERY' : pageNum === '04' ? 'ACCESSIBILITY' : 'FINAL SUMMARY'}
            </span>
            <span className="text-white/30 text-[7px] font-bold mt-1 tracking-widest uppercase">Private Document</span>
        </div>
    </div>
  );

  const PageFooter = ({ pageNum }: { pageNum: string }) => (
    <div className="h-[40px] w-full px-10 border-t border-slate-100 flex justify-between items-center bg-white z-10 shrink-0">
        <span className="text-[8px] font-black text-slate-300 tracking-[0.3em] uppercase">{info.confidentialText}</span>
        <span className="text-[8px] font-black text-slate-400 tracking-widest uppercase">Page {pageNum} / 05</span>
    </div>
  );

  const renderPage1 = () => (
    <div className="page-break-container">
        <div className="a4-landscape-preview bg-white font-sans overflow-hidden flex flex-col justify-between relative" style={{ paddingLeft: '160px', paddingRight: '120px', paddingTop: '100px', paddingBottom: '100px' }}>
            {/* Background Accent Line */}
            <div className="absolute top-0 left-0 w-3 h-full" style={{ backgroundColor: colorTheme.primary }}></div>
            
            <div className="w-full">
                <div className="mb-14">
                    <p className="text-xl font-bold text-slate-400 mb-6 tracking-[0.2em]">{info.page1.subTitle}</p>
                    <h1 className="text-[80px] font-black text-navy-900 leading-[1.0] whitespace-pre-line tracking-tighter mb-24 drop-shadow-sm">{info.page1.title}</h1>
                </div>

                <div className="space-y-4 mb-20">
                    <p className="text-3xl font-black text-navy-900 flex items-center gap-6">
                        {info.agent.name} {info.agent.representative} 
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        <span className="text-navy-700">{info.agent.phone}</span>
                    </p>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.4em]">{info.agent.email}</p>
                </div>
            </div>

            <div className="w-full">
                <div className="flex items-end justify-between pt-12 border-t border-slate-100">
                    <div className="flex items-center gap-10">
                        <div className="h-16 w-36 flex items-center shrink-0">
                            {info.agent.logoImage ? (
                                <img src={info.agent.logoImage} className="h-full object-contain object-left" />
                            ) : (
                                <div className="h-full w-full bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200 rounded text-[9px] font-black text-slate-300 uppercase">Logo</div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-black text-navy-900 uppercase leading-none">{info.agent.office}</p>
                            <p className="text-sm font-bold text-slate-400 underline underline-offset-8 decoration-gold-500/30 tracking-tight">{info.agent.website}</p>
                        </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                        <p className="text-lg font-bold text-slate-600 leading-tight">{info.agent.address}</p>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-tight leading-tight">{info.agent.addressEn}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderPage2 = () => (
    <div className="page-break-container">
        <div className="a4-landscape-preview flex flex-col bg-white overflow-hidden">
            <PageHeader pageNum="02" title={info.page2.title} subTitle={info.page2.subTitle} tag="PROPERTY INFORMATION" />
            <div className="flex-1 pt-6 px-10 pb-8 flex gap-10 min-h-0">
                <div className="flex-1 overflow-hidden">
                    <div className="grid grid-cols-1">
                        {Object.entries(info.page2.specs).map(([label, value], i) => (
                            <div key={label} className={`flex items-center py-2 px-4 ${label === '매매가' ? 'bg-orange-50' : i % 2 === 0 ? 'bg-slate-50/30' : ''}`}>
                                <div className="w-32 text-slate-500 font-bold text-[11px] uppercase tracking-tighter truncate">{label}</div>
                                <div className={`flex-1 font-black text-sm ${label === '매매가' ? 'text-orange-700 text-lg' : 'text-navy-900'}`}>{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-[450px] flex flex-col gap-6 h-full min-h-0">
                    <div className="flex-1 bg-slate-50 rounded-2xl overflow-hidden relative border shadow-inner">
                        {info.page2.mainImage ? <img src={info.page2.mainImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><BuildingOfficeIcon className="w-20" /></div>}
                    </div>
                    <div className={`grid grid-cols-3 gap-3 ${currentStyle.font} shrink-0`}>
                        <div className={`bg-white shadow-sm p-3 text-center border-l-4 ${currentStyle.radius}`} style={{ borderLeftColor: colorTheme.primary }}>
                            <span className="text-[8px] font-black text-slate-400 block mb-1 uppercase truncate font-sans">CONNECTIVITY</span>
                            <span className="text-[10px] font-black text-navy-900 truncate">{info.page2.investmentSummary.connectivity}</span>
                        </div>
                        <div className={`bg-white shadow-sm p-3 text-center border-l-4 ${currentStyle.radius}`} style={{ borderLeftColor: colorTheme.primary }}>
                            <span className="text-[8px] font-black text-slate-400 block mb-1 uppercase truncate font-sans">ASSET QUALITY</span>
                            <span className="text-[10px] font-black text-navy-900 truncate">{info.page2.investmentSummary.assetQuality}</span>
                        </div>
                        <div className={`bg-white shadow-sm p-3 text-center border-l-4 ${currentStyle.radius}`} style={{ borderLeftColor: colorTheme.primary }}>
                            <span className="text-[8px] font-black text-slate-400 block mb-1 uppercase truncate font-sans">SUITABILITY</span>
                            <span className="text-[10px] font-black text-navy-900 truncate">{info.page2.investmentSummary.suitability}</span>
                        </div>
                    </div>
                </div>
            </div>
            <PageFooter pageNum="02" />
        </div>
    </div>
  );

  const renderPage3 = () => (
    <div className="page-break-container">
        <div className="a4-landscape-preview flex flex-col bg-white overflow-hidden">
            <PageHeader pageNum="03" title={info.page3.title} subTitle={info.page3.subTitle} tag="PROPERTY VISUALS" />
            <div className="flex-1 p-10 min-h-0">
                <div className="grid grid-cols-4 grid-rows-2 gap-4 h-full">
                    <div className="col-span-2 row-span-2 bg-slate-50 rounded-2xl overflow-hidden relative border shadow-sm">
                        {info.page3.photos[0]?.url && <img src={info.page3.photos[0].url} className="w-full h-full object-cover" />}
                        <div className="absolute bottom-6 left-6 bg-navy-900/90 px-4 py-2 rounded-lg text-white font-black text-[10px] tracking-widest uppercase">{info.page3.photos[0]?.label || 'Exterior Main'}</div>
                    </div>
                    {info.page3.photos.slice(1, 4).map(photo => (
                        <div key={photo.id} className="bg-slate-50 rounded-2xl overflow-hidden relative border shadow-sm h-full min-h-0">
                            {photo.url && <img src={photo.url} className="w-full h-full object-cover" />}
                            <div className="absolute bottom-3 left-3 bg-navy-900/80 px-3 py-1.5 rounded text-[9px] text-white font-black truncate max-w-[90%] uppercase">{photo.label}</div>
                        </div>
                    ))}
                    <div className="bg-slate-50 rounded-2xl overflow-hidden relative border shadow-sm h-full min-h-0">
                        {info.page3.photos[4]?.url && <img src={info.page3.photos[4].url} className="w-full h-full object-cover" />}
                        <div className="absolute bottom-3 left-3 bg-navy-900/80 px-3 py-1.5 rounded text-[9px] text-white font-black truncate max-w-[90%] uppercase">{info.page3.photos[4]?.label || 'Detail'}</div>
                    </div>
                </div>
            </div>
            <PageFooter pageNum="03" />
        </div>
    </div>
  );

  const renderPage4 = () => (
    <div className="page-break-container">
        <div className="a4-landscape-preview flex flex-col bg-white overflow-hidden">
            <PageHeader pageNum="04" title={info.page4.title} subTitle={info.page4.subTitle} tag="AREA ANALYSIS" />
            <div className="flex-1 p-10 flex gap-10 min-h-0">
                <div className="flex-1 flex flex-col gap-6 h-full">
                    <div className="flex-1 bg-slate-50 rounded-3xl overflow-hidden relative border shadow-inner">
                        {info.page4.mapImage ? <img src={info.page4.mapImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-white/50"><MapPinIcon className="w-16 h-16 text-blue-500 opacity-50" /></div>}
                    </div>
                    <div className="grid grid-cols-3 gap-4 shrink-0 font-sans">
                        {Object.entries(info.page4.accessibility).map(([k, v]) => (
                            <div key={k} className="bg-white border rounded-2xl p-5 shadow-sm">
                                <span className="text-[9px] font-black text-slate-400 block mb-2 uppercase">{k}</span>
                                <p className="text-[10px] font-bold text-slate-800 leading-relaxed truncate-2">{v as string}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-[380px] bg-navy-900 rounded-[32px] p-10 flex flex-col justify-center shrink-0">
                    <h4 className="text-2xl font-black text-white mb-6 leading-tight">{info.page4.locationStrategyTitle}</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6"> {info.page4.locationStrategyContent}</p>
                    <div className="h-px w-full bg-white/10 mb-8"></div>
                    <p className="text-xs text-gold-500 font-black italic uppercase">{info.page4.targetLocationDesc}</p>
                </div>
            </div>
            <PageFooter pageNum="04" />
        </div>
    </div>
  );

  const renderPage5 = () => (
    <div className="page-break-container">
        <div className="a4-landscape-preview flex flex-col bg-white overflow-hidden">
            <PageHeader pageNum="05" title={info.page5.title} subTitle={info.page5.subTitle} tag="INVESTMENT ROADMAP" />
            <div className="flex-1 p-12 flex flex-col justify-center gap-6 min-h-0">
                <div className="grid grid-cols-2 gap-6">
                    {info.page5.roadmapCards.map(card => (
                        <div key={card.id} className={`bg-white p-6 flex items-start gap-6 relative overflow-hidden shadow-sm border ${currentStyle.radius} ${currentStyle.border}`}>
                            <div className={`w-16 h-16 shrink-0 bg-slate-50 flex items-center justify-center text-slate-500 transition-all ${currentStyle.radius}`}>{getIcon(card.icon)}</div>
                            <div className="flex flex-col pt-1">
                                <h4 className={`text-lg font-black text-navy-900 mb-2 ${layoutTheme === 'luxury' ? 'font-serif' : ''}`}>{card.title}</h4>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{card.description}</p>
                            </div>
                            <div className="absolute top-0 right-0 w-16 h-1" style={{ backgroundColor: colorTheme.primary }}></div>
                        </div>
                    ))}
                </div>
                <p className="text-xl font-serif-en italic text-slate-300 text-right pr-6 mt-4">"{info.page5.footerSlogan}"</p>
            </div>
            <PageFooter pageNum="05" />
        </div>
    </div>
  );

  return (
    <div ref={ref} className="report-root">
        <div className="screen-preview block no-print h-auto">
            {currentPage === 1 && renderPage1()}
            {currentPage === 2 && renderPage2()}
            {currentPage === 3 && renderPage3()}
            {currentPage === 4 && renderPage4()}
            {currentPage === 5 && renderPage5()}
        </div>
        <div className="print-master hidden print:block">
            {printPages[0] && renderPage1()}
            {printPages[1] && renderPage2()}
            {printPages[2] && renderPage3()}
            {printPages[3] && renderPage4()}
            {printPages[4] && renderPage5()}
        </div>
        <style>{`
            @media print {
                @page {
                    size: 297mm 210mm;
                    margin: 0 !important;
                }
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    height: auto !important;
                    overflow: visible !important;
                    width: 297mm !important;
                    -webkit-print-color-adjust: exact !important;
                }
                .no-print, header, aside, .canvas-wrapper > div:not(.report-root) {
                    display: none !important;
                }
                .report-root, .print-master {
                    display: block !important;
                    width: 297mm !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .page-break-container {
                    display: block !important;
                    width: 297mm !important;
                    height: 210mm !important;
                    page-break-after: always !important;
                    page-break-before: always !important;
                    page-break-inside: avoid !important;
                    break-after: page !important;
                    overflow: hidden !important;
                    margin: 0 !important;
                }
                .a4-landscape-preview {
                    display: flex !important;
                    width: 297mm !important;
                    height: 210mm !important;
                    max-width: 297mm !important;
                    max-height: 210mm !important;
                    background: white !important;
                    border: none !important;
                    box-shadow: none !important;
                    margin: 0 !important;
                }
                * { box-sizing: border-box !important; }
            }
            @media screen {
                .print-master { display: none !important; }
                .screen-preview { width: 1122px; margin: 0 auto; padding-bottom: 50px; }
                .a4-landscape-preview {
                    width: 1122px; height: 794px; background: white;
                    box-shadow: 0 0 40px rgba(0,0,0,0.1); margin-bottom: 30px;
                    display: flex; overflow: hidden;
                }
            }
        `}</style>
    </div>
  );
});

ReportCanvas.displayName = 'ReportCanvas';

export default ReportCanvas;
