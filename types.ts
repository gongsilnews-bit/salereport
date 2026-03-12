
export type SectionType = 'status' | 'overview' | 'roadmap' | 'photos' | 'location';

export interface BuildingFloorInfo {
  id: string;
  floor: string;
  usage: string;
  tenancy: string;
  status: string;
  remarks: string;
}

export interface ValuationData {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface RoadmapCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PropertyInfo {
  // Main Project Info (Used across pages)
  projectTitle: string;   // e.g. "서초동 역세권 꼬마빌딩 매매 안내서"
  propertyName: string;   // e.g. "서전빌"
  targetAddress: string;  // e.g. "서울 서초구 서초동 1444-9"
  
  // Footer Info
  confidentialText: string;
  pageInfo: string;

  // Page 1: Cover Page (표지)
  page1: {
    title: string;
    subTitle: string;
    mainImage: string | null;
  };

  // Page 2: Property Overview (물건개요)
  page2: {
    title: string;
    subTitle: string;
    specs: {
      소재지: string;
      용도지역: string;
      대지면적: string;
      연면적: string;
      건물규모: string;
      주용도: string;
      주차대수: string;
      승강기: string;
      준공연도: string;
      매매가: string;
    };
    locationIndex: string;
    investmentSummary: {
      connectivity: string;
      assetQuality: string;
      suitability: string;
    };
    mainImage: string | null;
  };

  // Page 3: Photos (현장 사진)
  page3: {
    title: string;
    subTitle: string;
    photos: {
        id: string;
        url: string | null;
        label: string;
        type: 'main' | 'sub';
    }[];
  };

  // Page 4: Location (입지 및 위치도)
  page4: {
    title: string;
    subTitle: string;
    mapImage: string | null;
    accessibility: {
      station: string;
      cultural: string;
      connectivity: string;
    };
    locationStrategyTitle: string;
    locationStrategyContent: string;
    targetLocationDesc: string;
  };

  // Page 5: Value & Roadmap (가치 및 로드맵)
  page5: {
    title: string;
    subTitle: string;
    roadmapCards: RoadmapCard[];
    footerSlogan: string;
  };


  // Agent Info
  agent: {
    name: string;
    office: string;
    phone: string;
    mobile: string;
    representative: string;
    address: string;
    addressEn: string;
    email: string;
    regNo: string;
    website: string;
    logoImage: string | null;
  };
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  expiryDate?: string;
  isPremium: boolean;
}

export interface ReportState {
  user: User | null;
  info: PropertyInfo;
  colorTheme: {
    primary: string;
    secondary: string;
    dark: string;
    bg: string;
    text: string;
  };
  layoutTheme: 'modern' | 'luxury' | 'natural' | 'bold' | 'high-end';
  currentPage: number;
}
