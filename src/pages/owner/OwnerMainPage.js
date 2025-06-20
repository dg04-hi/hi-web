import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Button,
  LinearProgress,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  Psychology, 
  Assignment,
  ShoppingCart,
  Star,
  TrendingUp,
  Assessment
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import { analyticsService } from '../../services/analyticsService';
import OwnerHeader from '../../components/common/OwnerHeader';
import OwnerNavigation from '../../components/common/Navigation';

const OwnerMainPage = () => {
  const navigate = useNavigate();
  const { selectedStoreId, loading: storeLoading, stores, error: storeError } = useSelectedStore();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false); // 리다이렉트 상태 추가

  // 매장이 선택되면 자동으로 분석 페이지로 리다이렉트 (단, 한 번만)
  useEffect(() => {
    if (!storeLoading && selectedStoreId && !hasRedirected) {
      console.log('매장 선택됨, 분석 페이지로 이동:', selectedStoreId);
      setHasRedirected(true);
      navigate(`/owner/analytics/${selectedStoreId}`, { replace: true });
    }
  }, [selectedStoreId, storeLoading, navigate, hasRedirected]);

  useEffect(() => {
    if (selectedStoreId) {
      loadAnalyticsData();
    }
  }, [selectedStoreId]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // 주문 통계와 리뷰 분석 데이터를 로드
      const response = await analyticsService.getStoreAnalytics(selectedStoreId);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('분석 데이터 로드 실패:', error);
      setAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  };

  // AI 피드백 버튼 클릭 핸들러
  const handleAIFeedbackClick = () => {
    navigate('/owner/ai-feedback');
  };

  // 실행 계획 버튼 클릭 핸들러
  const handleActionPlanClick = () => {
    navigate('/owner/action-plan/list');
  };

  // 매장 정보 로딩 중인 경우
  if (storeLoading) {
    return (
      <Box className="mobile-container">
        <OwnerHeader 
          title="매장 분석"
          subtitle="매장 정보 확인 중..."
          showStoreSelector={true}
          showBackButton={false}
          onBack={() => navigate('/owner/mypage')}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            매장 정보를 불러오는 중...
          </Typography>
        </Box>
        <OwnerNavigation />
      </Box>
    );
  }

  // 매장이 명확히 없는 경우만 등록 안내 표시
  if (!storeLoading && (!stores || stores.length === 0) && !storeError) {
    return (
      <Box className="mobile-container">
        <OwnerHeader 
          title="매장 분석"
          subtitle="매장을 등록해주세요"
          showStoreSelector={false}
          showBackButton={false}
          onBack={() => navigate('/owner/mypage')}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>등록된 매장이 없습니다</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            매장을 먼저 등록해주세요.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/owner/store/register')}
          >
            매장 등록하기
          </Button>
        </Box>
        <OwnerNavigation />
      </Box>
    );
  }

  // 오류가 발생한 경우
  if (storeError) {
    return (
      <Box className="mobile-container">
        <OwnerHeader 
          title="매장 분석"
          subtitle="오류 발생"
          showStoreSelector={true}
          showBackButton={false}
          onBack={() => navigate('/owner/mypage')}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>매장 정보를 불러올 수 없습니다</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            새로고침 후 다시 시도해주세요.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            새로고침
          </Button>
        </Box>
        <OwnerNavigation />
      </Box>
    );
  }

  // 기본 로딩 화면 (fallback)
  return (
    <Box className="mobile-container">
      <OwnerHeader 
        title="매장 분석"
        subtitle="로딩 중..."
        showStoreSelector={true}
        showBackButton={false}
        onBack={() => navigate('/owner/mypage')}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>로딩 중...</Typography>
      </Box>
      <OwnerNavigation />
    </Box>
  );
};

export default OwnerMainPage;