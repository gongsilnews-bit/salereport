
import React, { useEffect, useState } from 'react';
import { PropertyInfo } from '../types';
import { compressImage } from '../utils/imageUtils';
import { 
    ChevronDownIcon, 
    ChevronUpIcon, 
    PhotoIcon, 
    BuildingOfficeIcon, 
    MapIcon,
    IdentificationIcon,
    TableCellsIcon,
    PresentationChartLineIcon,
    PlusIcon,
    MinusIcon,
    SwatchIcon,
    Squares2X2Icon,
    HomeIcon,
    ChartBarIcon,
    WrenchIcon,
    ArrowTrendingUpIcon,
    CurrencyDollarIcon,
    LightBulbIcon,
    ClipboardDocumentCheckIcon,
    PaintBrushIcon,
    SparklesIcon,
    UserGroupIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';

interface ReportFormProps {
  info: PropertyInfo;
  setInfo: (info: PropertyInfo) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  colorTheme: any;
  onColorChange: (theme: any) => void;
  layoutTheme: string;
  onLayoutChange: (theme: any) => void;
  onAiAnalysis?: (file: File) => void;
  isAiLoading?: boolean;
}

const AccordionSection = ({ id, activeAccordion, toggleAccordion, title, icon, children }: { id: string, activeAccordion: string | null, toggleAccordion: (id: string) => void, title: string, icon: any, children: React.ReactNode }) => (
  <div className="border-b border-slate-100 last:border-none">
    <button 
      onClick={() => toggleAccordion(id)}
      className={`w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors ${activeAccordion === id ? 'bg-slate-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${activeAccordion === id ? 'bg-navy-900 text-gold-500' : 'bg-slate-100 text-slate-500'}`}>
          {React.createElement(icon, { className: "w-5 h-5" })}
        </div>
        <span className={`font-bold text-sm ${activeAccordion === id ? 'text-navy-900' : 'text-slate-600'}`}>{title}</span>
      </div>
      {activeAccordion === id ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
    </button>
    {activeAccordion === id && (
      <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-300">
        {children}
      </div>
    )}
  </div>
);

const COLOR_PALETTES = [
  { id: 'teal', primary: '#0d9488', secondary: '#0f172a', label: 'Teal' },
  { id: 'gold', primary: '#b48e4d', secondary: '#332511', label: 'Gold' },
  { id: 'forest', primary: '#15803d', secondary: '#14532d', label: 'Forest' },
  { id: 'burgundy', primary: '#991b1b', secondary: '#7f1d1d', label: 'Burgundy' },
  { id: 'orange', primary: '#d97706', secondary: '#b45309', label: 'Orange' },
];

const LAYOUT_THEMES = [
  { id: 'modern', label: 'Modern' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'natural', label: 'Natural' },
  { id: 'bold', label: 'Bold' },
  { id: 'high-end', label: 'High-end' },
];

const ReportForm: React.FC<ReportFormProps> = ({ 
    info, setInfo, currentPage, onPageChange, 
    colorTheme, onColorChange, layoutTheme, onLayoutChange,
    onAiAnalysis, isAiLoading
}) => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('page1');

  useEffect(() => {
    if (currentPage >= 1 && currentPage <= 5) {
        setActiveAccordion(`page${currentPage}`);
    }
  }, [currentPage]);

  const handleInfoChange = (path: string, value: any) => {
    const newInfo = JSON.parse(JSON.stringify(info));
    const parts = path.split('.');
    let current: any = newInfo;
    for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    setInfo(newInfo);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        handleInfoChange(path, compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const adjustPhotoCount = (count: number) => {
    const currentPhotos = [...info.page3.photos];
    if (count > currentPhotos.length) {
        const diff = count - currentPhotos.length;
        for (let i = 0; i < diff; i++) {
            currentPhotos.push({
                id: `p${currentPhotos.length + 1}`,
                url: null,
                label: `Photo ${currentPhotos.length + 1}`,
                type: 'sub'
            });
        }
    } else if (count < currentPhotos.length) {
        currentPhotos.splice(count);
    }
    handleInfoChange('page3.photos', currentPhotos);
  };

  const toggleAccordion = (id: string) => {
    const nextState = activeAccordion === id ? null : id;
    setActiveAccordion(nextState);
    if (nextState && nextState.startsWith('page')) {
        const pageNum = parseInt(nextState.replace('page', ''));
        if (!isNaN(pageNum)) onPageChange(pageNum);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-6 bg-slate-50 border-b flex flex-col gap-1">
        <h2 className="text-xl font-black text-navy-900">데이터 입력 창</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Layout Auto-Sync Active</p>
      </div>

      <div className="p-6 border-b space-y-6 bg-white">
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-navy-900 font-bold text-sm">
                <SwatchIcon className="w-5 h-5" /> 디자인 색상 선택
            </div>
            <div className="flex items-center gap-3">
                {COLOR_PALETTES.map(p => (
                    <button 
                        key={p.id} 
                        onClick={() => onColorChange(p)}
                        className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${colorTheme.id === p.id ? 'border-navy-900 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                    >
                        <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: p.primary }}>
                            {colorTheme.id === p.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </div>
                    </button>
                ))}
                
                {/* Custom Color Picker */}
                <div className="relative group">
                    <button 
                        className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 flex items-center justify-center overflow-hidden ${colorTheme.id === 'custom' ? 'border-navy-900 scale-110 shadow-lg' : 'border-slate-100 hover:border-slate-300'}`}
                        style={{ backgroundColor: colorTheme.id === 'custom' ? colorTheme.primary : '#f8fafc' }}
                        onClick={() => document.getElementById('custom-color-input')?.click()}
                    >
                        {colorTheme.id === 'custom' ? (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        ) : (
                            <PaintBrushIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                        )}
                    </button>
                    <input 
                        id="custom-color-input"
                        type="color" 
                        className="absolute inset-0 opacity-0 cursor-pointer w-0 h-0"
                        value={colorTheme.id === 'custom' ? colorTheme.primary : '#000000'}
                        onChange={(e) => onColorChange({
                            id: 'custom',
                            primary: e.target.value,
                            secondary: '#0f172a',
                            label: 'Custom'
                        })}
                    />
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-2 text-navy-900 font-bold text-sm">
                <Squares2X2Icon className="w-5 h-5" /> 레이아웃 테마 선택
            </div>
            <div className="grid grid-cols-5 gap-2">
                {LAYOUT_THEMES.map((t, i) => (
                    <button 
                        key={t.id} 
                        onClick={() => onLayoutChange(t.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2 ${layoutTheme === t.id ? 'bg-navy-900 border-navy-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                        <span className="text-lg font-black leading-none">{i + 1}</span>
                        <span className={`text-[9px] font-bold tracking-tighter ${layoutTheme === t.id ? 'text-white' : 'text-slate-600'}`}>{t.label}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>

      <AccordionSection id="page1" activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} title="1페이지: 리포트 표지" icon={IdentificationIcon}>
        <div className="space-y-6">
            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase">표지 정보</label>
                <div>
                    <label className="text-[9px] font-bold text-slate-600 block mb-1">메인 타이틀</label>
                    <textarea value={info.page1.title} onChange={(e) => handleInfoChange('page1.title', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded text-xs outline-none font-black" rows={2} />
                </div>
                <div>
                    <label className="text-[9px] font-bold text-slate-600 block mb-1">서브 타이틀 (주소)</label>
                    <input type="text" value={info.page1.subTitle} onChange={(e) => handleInfoChange('page1.subTitle', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" />
                </div>
                <div>
                    <label className="text-[9px] font-bold text-slate-600 block mb-1">표지 메인 이미지</label>
                    <button className="w-full h-32 border-2 border-dashed rounded-xl bg-slate-50 text-gold-600 font-bold text-xs flex items-center justify-center relative overflow-hidden">
                        {info.page1.mainImage ? <img src={info.page1.mainImage} className="w-full h-full object-cover" /> : "이미지 업로드"}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'page1.mainImage')} />
                    </button>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <label className="text-[10px] font-black text-slate-400 uppercase">부동산 및 담당자 정보</label>
                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="text-[9px] font-bold text-slate-600">회사명</label>
                        <input type="text" value={info.agent.office} onChange={(e) => handleInfoChange('agent.office', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[9px] font-bold text-slate-600">담당자명</label>
                            <input type="text" value={info.agent.name} onChange={(e) => handleInfoChange('agent.name', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" />
                        </div>
                        <div>
                            <label className="text-[9px] font-bold text-slate-600">직함</label>
                            <input type="text" value={info.agent.representative} onChange={(e) => handleInfoChange('agent.representative', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[9px] font-bold text-slate-600">연락처</label>
                        <input type="text" value={info.agent.phone} onChange={(e) => handleInfoChange('agent.phone', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" />
                    </div>
                    <div>
                        <label className="text-[9px] font-bold text-slate-600">이메일</label>
                        <input type="text" value={info.agent.email} onChange={(e) => handleInfoChange('agent.email', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" />
                    </div>
                    <div>
                        <label className="text-[9px] font-bold text-slate-600">웹사이트</label>
                        <input type="text" value={info.agent.website} onChange={(e) => handleInfoChange('agent.website', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" />
                    </div>
                    <div>
                        <label className="text-[9px] font-bold text-slate-600">주소 (한글)</label>
                        <input type="text" value={info.agent.address} onChange={(e) => handleInfoChange('agent.address', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" />
                    </div>
                    <div>
                        <label className="text-[9px] font-bold text-slate-600">주소 (영문)</label>
                        <input type="text" value={info.agent.addressEn} onChange={(e) => handleInfoChange('agent.addressEn', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-600">로고 이미지</label>
                        <button className="w-full h-20 border-2 border-dashed rounded-xl bg-slate-50 text-slate-400 font-bold text-xs flex items-center justify-center relative overflow-hidden">
                            {info.agent.logoImage ? <img src={info.agent.logoImage} className="w-full h-full object-contain" /> : "로고 업로드"}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'agent.logoImage')} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </AccordionSection>

      <AccordionSection id="page2" activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} title="2페이지: 물건 개요" icon={BuildingOfficeIcon}>
        <div className="space-y-6">
            <div 
                className={`p-4 rounded-xl border flex items-center justify-between group transition-all shadow-sm relative overflow-hidden ${isAiLoading ? 'bg-slate-50 border-slate-200 cursor-wait' : 'bg-navy-50 border-navy-100 hover:border-navy-300 cursor-pointer'}`}
                onClick={() => !isAiLoading && document.getElementById('ai-analysis-input')?.click()}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-inner ${isAiLoading ? 'bg-slate-300 text-slate-500' : 'bg-navy-900 text-gold-500'}`}>
                        <SparklesIcon className={`w-6 h-6 ${isAiLoading ? 'animate-spin' : 'animate-pulse'}`} />
                    </div>
                    <div>
                        <p className={`text-xs font-black ${isAiLoading ? 'text-slate-400' : 'text-navy-900'}`}>AI 스마트 매물 분석</p>
                        <p className="text-[10px] text-navy-500 font-bold">{isAiLoading ? 'AI가 매물 정보를 분석하고 있습니다...' : '이미지를 첨부하면 데이터를 자동으로 채워줍니다'}</p>
                    </div>
                </div>
                <button 
                  disabled={isAiLoading}
                  className={`px-4 py-2 text-[11px] font-black rounded-lg shadow-lg transition-all flex items-center gap-2 relative z-10 ${isAiLoading ? 'bg-slate-200 text-slate-400 cursor-wait' : 'bg-navy-900 text-white hover:bg-black'}`}
                >
                    <PhotoIcon className="w-4 h-4" /> {isAiLoading ? '분석 중...' : '사진 업로드'}
                </button>
                <input 
                    id="ai-analysis-input"
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    disabled={isAiLoading}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && onAiAnalysis) {
                            onAiAnalysis(file);
                        }
                    }}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {Object.entries(info.page2.specs).map(([key, value]) => (
                    <div key={key}>
                        <label className="text-[9px] font-black text-slate-400 uppercase">{key}</label>
                        <input type="text" value={value as string} onChange={(e) => handleInfoChange(`page2.specs.${key}`, e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" />
                    </div>
                ))}
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest">투자 포인트 (Investment Summary)</label>
                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase">CONNECTIVITY (교통/입지)</label>
                        <input type="text" value={info.page2.investmentSummary.connectivity} onChange={(e) => handleInfoChange('page2.investmentSummary.connectivity', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" placeholder="예: 전철역 도보 4분" />
                    </div>
                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase">ASSET QUALITY (자산 상태)</label>
                        <input type="text" value={info.page2.investmentSummary.assetQuality} onChange={(e) => handleInfoChange('page2.investmentSummary.assetQuality', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" placeholder="예: 내외관 리모델링 완료" />
                    </div>
                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase">SUITABILITY (용도/적합성)</label>
                        <input type="text" value={info.page2.investmentSummary.suitability} onChange={(e) => handleInfoChange('page2.investmentSummary.suitability', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" placeholder="예: 사옥 및 수익형 최적" />
                    </div>
                </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest text-center block">메인 이미지</label>
                <button className="w-full h-32 border-2 border-dashed rounded-xl bg-slate-50 text-gold-600 font-bold text-xs uppercase relative overflow-hidden flex items-center justify-center">
                    {info.page2.mainImage ? <img src={info.page2.mainImage} className="w-full h-full object-cover" /> : "메인 이미지 업로드"}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'page2.mainImage')} />
                </button>
            </div>
        </div>
      </AccordionSection>

      <AccordionSection id="page3" activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} title="3페이지: 사진 갤러리" icon={PhotoIcon}>
        <div className="space-y-6">
          <div className="bg-navy-900 text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
             <span className="text-xs font-black tracking-widest">사진 개수 조절</span>
             <div className="flex items-center gap-4">
                <button onClick={() => adjustPhotoCount(Math.max(2, info.page3.photos.length - 1))} className="p-1 hover:text-gold-500"><MinusIcon className="w-5 h-5" /></button>
                <span className="text-xl font-black text-gold-500 w-6 text-center">{info.page3.photos.length}</span>
                <button onClick={() => adjustPhotoCount(Math.min(6, info.page3.photos.length + 1))} className="p-1 hover:text-gold-500"><PlusIcon className="w-5 h-5" /></button>
             </div>
          </div>

          <div className="space-y-4">
            {info.page3.photos.map((photo, index) => (
              <div key={photo.id} className="p-3 bg-slate-50 rounded-xl border flex gap-4 items-center group">
                <div className="w-16 h-16 bg-white rounded-lg border overflow-hidden shrink-0 relative flex items-center justify-center">
                  {photo.url ? <img src={photo.url} className="w-full h-full object-cover" /> : <PhotoIcon className="w-6 h-6 text-slate-200" />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                          const compressed = await compressImage(reader.result as string);
                          const next = [...info.page3.photos];
                          next[index].url = compressed;
                          handleInfoChange('page3.photos', next);
                        };
                        reader.readAsDataURL(file);
                      }
                  }} />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-black text-slate-400 block mb-1">PHOTO {index + 1} LABEL</span>
                  <input type="text" value={photo.label} onChange={(e) => {
                    const next = [...info.page3.photos];
                    next[index].label = e.target.value;
                    handleInfoChange('page3.photos', next);
                  }} className="w-full px-3 py-1.5 bg-white border rounded text-xs outline-none focus:ring-1 focus:ring-gold-500 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </AccordionSection>

      <AccordionSection id="page4" activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} title="4페이지: 위치 및 분석" icon={MapIcon}>
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">위치도 사진</label>
                <button className="w-full h-32 border-2 border-dashed rounded-xl bg-slate-50 text-gold-600 font-bold text-xs uppercase relative overflow-hidden flex items-center justify-center">
                    {info.page4.mapImage ? <img src={info.page4.mapImage} className="w-full h-full object-cover" /> : "위치도 업로드"}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'page4.mapImage')} />
                </button>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">입지 전략</label>
                <input type="text" value={info.page4.locationStrategyTitle} onChange={(e) => handleInfoChange('page4.locationStrategyTitle', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border rounded-lg text-sm outline-none font-bold" placeholder="전략 제목" />
                <textarea value={info.page4.locationStrategyContent} onChange={(e) => handleInfoChange('page4.locationStrategyContent', e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-50 border rounded-lg text-xs outline-none" placeholder="상세 내용" />
                <input type="text" value={info.page4.targetLocationDesc} onChange={(e) => handleInfoChange('page4.targetLocationDesc', e.target.value)} className="w-full px-4 py-2 bg-orange-50 border border-orange-100 rounded-lg text-xs font-black text-orange-700 italic outline-none" placeholder="핵심 강조 문구 (예: 희소성 높은 초역세권...)" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">접근성 정보</label>
                <div className="grid grid-cols-1 gap-2">
                    <input type="text" value={info.page4.accessibility.station} onChange={(e) => handleInfoChange('page4.accessibility.station', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" placeholder="지하철/교통" />
                    <input type="text" value={info.page4.accessibility.cultural} onChange={(e) => handleInfoChange('page4.accessibility.cultural', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" placeholder="문화/편의시설" />
                    <input type="text" value={info.page4.accessibility.connectivity} onChange={(e) => handleInfoChange('page4.accessibility.connectivity', e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs outline-none" placeholder="도로망 협의" />
                </div>
            </div>
        </div>
      </AccordionSection>

      <AccordionSection id="page5" activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} title="5페이지: 가치 및 로드맵" icon={PresentationChartLineIcon}>
        <div className="space-y-6">
          <div className="space-y-4">
            {info.page5.roadmapCards.map((card, index) => (
              <div key={card.id} className="p-4 bg-slate-50 rounded-xl border space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400">로드맵 카드 {index + 1}</span>
                  <div className="flex flex-wrap bg-white rounded-lg p-1 border gap-1 w-[160px]">
                    {[
                      'building', 'home', 'chart', 'crane', 
                      'trend', 'coin', 'idea', 'check', 
                      'paint', 'sparkle', 'users', 'bank'
                    ].map(iconName => (
                      <button 
                        key={iconName}
                        onClick={() => {
                          const next = [...info.page5.roadmapCards];
                          next[index].icon = iconName;
                          handleInfoChange('page5.roadmapCards', next);
                        }}
                        className={`p-1 rounded-md transition-all ${card.icon === iconName ? 'bg-navy-900 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-50'}`}
                        title={iconName}
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          {iconName === 'building' && <BuildingOfficeIcon className="w-full h-full" />}
                          {iconName === 'home' && <HomeIcon className="w-full h-full" />}
                          {iconName === 'chart' && <ChartBarIcon className="w-full h-full" />}
                          {iconName === 'crane' && <WrenchIcon className="w-full h-full" />}
                          {iconName === 'trend' && <ArrowTrendingUpIcon className="w-full h-full" />}
                          {iconName === 'coin' && <CurrencyDollarIcon className="w-full h-full" />}
                          {iconName === 'idea' && <LightBulbIcon className="w-full h-full" />}
                          {iconName === 'check' && <ClipboardDocumentCheckIcon className="w-full h-full" />}
                          {iconName === 'paint' && <PaintBrushIcon className="w-full h-full" />}
                          {iconName === 'sparkle' && <SparklesIcon className="w-full h-full" />}
                          {iconName === 'users' && <UserGroupIcon className="w-full h-full" />}
                          {iconName === 'bank' && <BanknotesIcon className="w-full h-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <input 
                  type="text" 
                  value={card.title} 
                  onChange={(e) => {
                    const next = [...info.page5.roadmapCards];
                    next[index].title = e.target.value;
                    handleInfoChange('page5.roadmapCards', next);
                  }} 
                  className="w-full px-3 py-2 bg-white border rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-gold-500" 
                  placeholder="제목"
                />
                <textarea 
                  value={card.description} 
                  onChange={(e) => {
                    const next = [...info.page5.roadmapCards];
                    next[index].description = e.target.value;
                    handleInfoChange('page5.roadmapCards', next);
                  }} 
                  rows={2}
                  className="w-full px-3 py-2 bg-white border rounded-lg text-xs outline-none focus:ring-1 focus:ring-gold-500 resize-none" 
                  placeholder="상세 내용"
                />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase">하단 슬로건</label>
            <input 
              type="text" 
              value={info.page5.footerSlogan} 
              onChange={(e) => handleInfoChange('page5.footerSlogan', e.target.value)} 
              className="w-full px-4 py-2 bg-slate-50 border rounded-lg text-sm outline-none" 
              placeholder="슬로건 입력"
            />
          </div>
        </div>
      </AccordionSection>
      
      <div className="h-20"></div>
    </div>
  );
};

export default ReportForm;
