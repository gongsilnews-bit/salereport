
import React, { useState, useRef, useEffect } from 'react';
import ReportForm from './components/ReportForm';
import ReportCanvas from './components/ReportCanvas';
import Auth from './components/Auth';
import { db, auth } from './services/firebase';
import { analyzePropertyImage } from './services/ai';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, Timestamp, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { PropertyInfo } from './types';
import { 
    CloudArrowUpIcon, 
    ArrowDownTrayIcon, 
    ListBulletIcon, 
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    TrashIcon,
    DocumentDuplicateIcon,
    PencilSquareIcon,
    CheckIcon
} from '@heroicons/react/24/solid';

const COLOR_PALETTES = [
  { id: 'teal', primary: '#0d9488', secondary: '#0f172a', dark: '#0f172a', bg: '#ffffff', text: '#1e293b' },
  { id: 'gold', primary: '#b48e4d', secondary: '#332511', dark: '#1e1b16', bg: '#ffffff', text: '#1e293b' },
  { id: 'forest', primary: '#15803d', secondary: '#14532d', dark: '#022c22', bg: '#ffffff', text: '#1e293b' },
  { id: 'burgundy', primary: '#991b1b', secondary: '#7f1d1d', dark: '#280505', bg: '#ffffff', text: '#1e293b' },
  { id: 'orange', primary: '#d97706', secondary: '#b45309', dark: '#3d1a00', bg: '#ffffff', text: '#1e293b' },
];

const INITIAL_INFO: PropertyInfo = {
  projectTitle: "서초동 역세권 꼬마빌딩 매매 안내서",
  propertyName: "",
  targetAddress: "서울 서초구 서초동 1444-9",
  confidentialText: "CONFIDENTIAL | INFORMATION MEMORANDUM",
  pageInfo: "PAGE 01 / 05",
  page1: {
    title: "AI 시세\n매매 보고서",
    subTitle: "서울 서초구 서초동 1444-9",
    mainImage: null
  },
  page2: {
    title: "물건개요", subTitle: "Property Overview",
    specs: {
      "소재지": "서울시 서초구 반포동 (논현역 역세권)",
      "용도지역": "제2종 일반주거지역",
      "대지면적": "220.2㎡ (66.61평)",
      "연면적": "537㎡ (162.44평)",
      "건물규모": "지하 1층 / 지상 5층",
      "주용도": "제2종 근린생활시설",
      "주차대수": "4대 (자주식)",
      "승강기": "1대 완비",
      "준공연도": "2017년 11월 16일",
      "매매가": "95억 원 (평당 1억 4,262만)"
    },
    locationIndex: "논현역(7호선, 신분당선) 도보 3분 더블 역세권 및 최상의 가시성",
    investmentSummary: {
      connectivity: "논현역(7호선, 신분당선) 도보 역세권 법인사옥 추천",
      assetQuality: "2017년 준공된 신축급 외관 및 관리 상태 최상",
      suitability: "사옥 및 임대 수익형으로 최적화된 입지 전략"
    },
    mainImage: null
  },
  page3: {
    title: "현장 사진", subTitle: "Actual Field Photos",
    photos: [
        { id: 'p1', url: null, label: '정면 외관', type: 'main' },
        { id: 'p2', url: null, label: '측면 사진', type: 'sub' },
        { id: 'p3', url: null, label: '출입구', type: 'sub' },
        { id: 'p4', url: null, label: '내부 전경', type: 'sub' },
        { id: 'p5', url: null, label: '옥상 공간', type: 'sub' },
    ]
  },
  page4: {
    title: "입지 및 위치도", subTitle: "Strategic Connectivity", mapImage: null,
    accessibility: { station: "남부터미널역 250m", cultural: "예술의전당 인근", connectivity: "남부순환로 용이" },
    locationStrategyTitle: "서초동 비즈니스 클러스터",
    locationStrategyContent: "대한민국 최고의 문화 인프라가 공존하는 핵심 요지입니다.",
    targetLocationDesc: "남부터미널역 도보 4분"
  },
  page5: {
    title: "가치 및 로드맵", subTitle: "Value & Roadmap",
    roadmapCards: [
      { id: 'r1', title: '단독 사옥 활용', description: '기업 아이덴티티 확보 가능', icon: 'building' },
      { id: 'r2', title: '수익 모델 전개', description: '주거 및 근생 혼합 수익형', icon: 'home' },
      { id: 'r3', title: '밸류업 전략', description: '전면 리모델링 시세차익', icon: 'chart' },
      { id: 'r4', title: '오피스 신축', description: '개발 이익 극대화', icon: 'crane' },
    ],
    footerSlogan: "최고의 입지에 미래 가치를 더합니다."
  },
  agent: {
    name: "이대표", office: "(주)강남공인부동산", phone: "010-1234-5678",
    mobile: "02-1234-5678", representative: "대표공인중개사", email: "gangnam@naver.com",
    address: "서울 서초구 강남대로39길 45-44", addressEn: "45-44 Gangnam-daero 39 gill, Seocho-gu, Seoul",
    regNo: "11650-2024", website: "gangnamrelay.co.kr", logoImage: null
  }
};

const ReportItem = ({ report, onLoad, onDelete, onCopy, onRename }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(report.info.projectTitle);

  return (
    <div className="p-4 bg-white border rounded-xl flex items-center justify-between group hover:border-gold-500 transition-all shadow-sm">
      <div className="flex-1 min-w-0 pr-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={tempTitle} 
              onChange={(e) => setTempTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 border rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-gold-500"
              autoFocus
            />
            <button 
              onClick={() => { onRename(tempTitle); setIsEditing(false); }}
              className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="font-bold text-navy-900 truncate">{report.info.projectTitle}</p>
            <p className="text-[10px] text-slate-400 mt-1">
              {report.createdAt ? new Date(report.createdAt.seconds * 1000).toLocaleString() : '날짜 정보 없음'}
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => setIsEditing(!isEditing)} className="p-2 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition-all" title="이름 수정">
          <PencilSquareIcon className="w-4 h-4" />
        </button>
        <button onClick={onCopy} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all" title="복사하기">
          <DocumentDuplicateIcon className="w-4 h-4" />
        </button>
        <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="삭제하기">
          <TrashIcon className="w-4 h-4" />
        </button>
        <button 
          onClick={onLoad} 
          className="ml-2 px-4 py-2 bg-navy-900 text-white text-xs font-bold rounded-lg hover:bg-navy-800 transition-all shadow-md active:scale-95"
        >
          불러오기
        </button>
      </div>
    </div>
  );
};

function App() {
  // Load initial data from localStorage if available
  const getInitialInfo = (): PropertyInfo => {
    const saved = localStorage.getItem('property_report_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
    return INITIAL_INFO;
  };

  const [user, setUser] = useState<any>(null);
  const [info, setInfo] = useState<PropertyInfo>(getInitialInfo());
  const [currentPage, setCurrentPage] = useState(1);
  const [colorTheme, setColorTheme] = useState(COLOR_PALETTES[0]);
  const [layoutTheme, setLayoutTheme] = useState('modern');

  const [isSaving, setIsSaving] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [printPages, setPrintPages] = useState<boolean[]>([true, true, true, true, true]);
  const reportRef = useRef<HTMLDivElement>(null);

  // Auto-save to localStorage whenever info changes
  useEffect(() => {
    localStorage.setItem('property_report_data', JSON.stringify(info));
  }, [info]);

  const handleReset = () => {
    if (window.confirm("작성 중인 모든 내용이 초기화됩니다. 계속하시겠습니까?")) {
      localStorage.removeItem('property_report_data');
      setInfo(INITIAL_INFO);
      alert("초기화되었습니다.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'User',
          isPremium: true
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveReport = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
        // Sanitize and Stringify to bypass "invalid nested entity" and handle size more robustly
        const sanitizedInfo = JSON.parse(JSON.stringify(info, (key, value) => 
            value === undefined ? null : value
        ));
        const infoString = JSON.stringify(sanitizedInfo);

        await addDoc(collection(db, 'reports'), { 
            userId: user.uid, 
            info: infoString, 
            createdAt: Timestamp.now() 
        });
        alert("성공적으로 저장되었습니다.");
        fetchSavedReports();
    } catch (e: any) { 
        console.error("저장 에러 상세:", e);
        if (e.message?.includes('too large')) {
            alert("저장 실패: 이미지 용량이 너무 큽니다. 사진 개수를 줄이거나 해상도를 낮춰주세요.");
        } else {
            alert(`저장 실패: ${e.message || '알 수 없는 오류'}`);
        }
    } finally { setIsSaving(false); }
  };

  const fetchSavedReports = async () => {
    if (!user) return;
    try {
        const q = query(collection(db, 'reports'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const reports = snap.docs.map(doc => {
            const data = doc.data();
            let reportInfo = data.info;
            // Support both old object format and new string format
            if (typeof reportInfo === 'string') {
                try {
                    reportInfo = JSON.parse(reportInfo);
                } catch (e) {
                    console.error("Parse error", e);
                }
            }
            return { id: doc.id, ...data, info: reportInfo };
        });
        setSavedReports(reports);
    } catch (e) {
        console.error("Fetch reports error", e);
    }
  };

  const deleteReport = async (id: string) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, 'reports', id));
      fetchSavedReports();
    } catch (e) { alert("삭제 실패"); }
  };

  const copyReport = async (report: any) => {
    try {
      const newInfo = { ...report.info, projectTitle: `${report.info.projectTitle} - 복사본` };
      await addDoc(collection(db, 'reports'), { 
        userId: user?.uid, 
        info: JSON.stringify(newInfo), 
        createdAt: Timestamp.now() 
      });
      fetchSavedReports();
    } catch (e) { alert("복사 실패"); }
  };

  const renameReport = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      const reportDoc = doc(db, 'reports', id);
      const snap = await getDoc(reportDoc);
      if (snap.exists()) {
        const data = snap.data();
        let reportInfo = data.info;
        if (typeof reportInfo === 'string') {
            const parsed = JSON.parse(reportInfo);
            parsed.projectTitle = newTitle;
            await updateDoc(reportDoc, { info: JSON.stringify(parsed) });
        } else {
            const updatedInfo = { ...data.info, projectTitle: newTitle };
            await updateDoc(reportDoc, { info: updatedInfo });
        }
        fetchSavedReports();
      }
    } catch (e) { alert("이름 변경 실패"); }
  };

  const handleAiAnalysis = async (file: File) => {
    setIsAiLoading(true);
    try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            const result = await analyzePropertyImage(base64);
            
            setInfo(prev => ({
                ...prev,
                page2: {
                    ...prev.page2,
                    specs: { ...prev.page2.specs, ...result },
                    locationIndex: result.locationIndex || prev.page2.locationIndex,
                    investmentSummary: {
                        ...prev.page2.investmentSummary,
                        ...(result.investmentSummary || {})
                    },
                    mainImage: base64 // 분석한 이미지를 대표 이미지로 설정
                }
            }));
            alert("AI 분석이 완료되었습니다!");
        };
        reader.readAsDataURL(file);
    } catch (e) {
        console.error("AI Analysis Error", e);
        alert("AI 분석 중 오류가 발생했습니다.");
    } finally {
        setIsAiLoading(false);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return <Auth onLogin={(u) => setUser(u)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      <header className="bg-navy-900 text-white p-4 flex justify-between items-center z-50 no-print">
        <h1 className="text-xl font-bold">🏢 건물매매보고서 AI 가이드</h1>
        <div className="flex gap-3">
          <button onClick={() => { setShowSavedModal(true); fetchSavedReports(); }} className="flex items-center gap-2 px-4 py-2 bg-navy-800 rounded-lg text-sm border border-white/10"><ListBulletIcon className="w-5 h-5 text-gold-500" /> 보관함</button>
          <button onClick={saveReport} disabled={isSaving} className="px-4 py-2 bg-gold-500 rounded-lg text-sm font-bold text-navy-900">저장하기</button>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-navy-800 rounded-lg text-sm border border-white/10"
            title="작성 중인 내용 초기화"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gold-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            초기화
          </button>
          <button onClick={() => auth.signOut()} className="p-2 text-slate-500 hover:text-white"><ArrowRightOnRectangleIcon className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
                <aside className="w-[450px] bg-white border-r overflow-y-auto no-print">
            <ReportForm 
                info={info} 
                setInfo={setInfo} 
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                colorTheme={colorTheme}
                onColorChange={setColorTheme}
                layoutTheme={layoutTheme}
                onLayoutChange={setLayoutTheme}
                onAiAnalysis={handleAiAnalysis}
                isAiLoading={isAiLoading}
            />
        </aside>
        <section className="flex-1 bg-slate-100 p-8 overflow-y-auto flex flex-col items-center">
            <div className="w-[1122px] flex justify-between items-center mb-6 no-print">
                <div className="flex bg-white rounded-lg p-1 border shadow-sm">
                    {[1, 2, 3, 4, 5].map(p => (
                        <button key={p} onClick={() => setCurrentPage(p)} className={`px-4 py-2 rounded-md text-xs font-bold ${currentPage === p ? 'bg-navy-900 text-white shadow-md' : 'text-slate-500'}`}>{p === 1 ? '표지' : `Page ${p-1}`}</button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white rounded-lg p-1 border shadow-sm items-center gap-1">
                        <p className="px-3 text-[10px] font-black text-slate-400 border-r">대상물건: {info.targetAddress}{info.propertyName ? ` (${info.propertyName})` : ''}</p>
                        {[1, 2, 3, 4, 5].map((p, i) => (
                            <button key={i} onClick={() => { const n = [...printPages]; n[i] = !n[i]; setPrintPages(n); }} className={`w-8 h-8 rounded text-[10px] font-black ${printPages[i] ? 'bg-gold-500 text-navy-950' : 'bg-slate-50 text-slate-300'}`}>{i === 0 ? '표' : i}</button>
                        ))}
                    </div>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-navy-900 text-white rounded-lg text-sm font-bold shadow-xl"><ArrowDownTrayIcon className="w-5 h-5 text-gold-500" /> PDF 출력</button>
                </div>
            </div>
            <div className="canvas-wrapper">
                <ReportCanvas data={{ user, info, currentPage, colorTheme, layoutTheme }} ref={reportRef} printPages={printPages} />
            </div>
        </section>
      </main>

      {showSavedModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold flex items-center gap-2 text-navy-900">
                        <ListBulletIcon className="w-5 h-5 text-gold-500" /> 리포트 보관함
                    </h3>
                    <button onClick={() => setShowSavedModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <XMarkIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                    {savedReports.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 text-sm">저장된 리포트가 없습니다.</div>
                    ) : (
                        savedReports.sort((a,b) => b.createdAt?.seconds - a.createdAt?.seconds).map(r => (
                            <ReportItem 
                                key={r.id} 
                                report={r} 
                                onLoad={() => { setInfo(r.info); setShowSavedModal(false); }}
                                onDelete={() => deleteReport(r.id)}
                                onCopy={() => copyReport(r)}
                                onRename={(newName) => renameReport(r.id, newName)}
                            />
                        ))
                    )}
                </div>
                <div className="p-4 bg-slate-50 border-t text-center">
                    <p className="text-[10px] text-slate-400">보관 가능 용량은 계정 플랜에 따라 다를 수 있습니다.</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default App;
