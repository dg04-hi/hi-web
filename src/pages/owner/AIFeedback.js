//* src/pages/owner/AIFeedback.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid,
  Chip,
  CircularProgress 
} from '@mui/material';
import { ArrowBack, TrendingUp, Psychology } from '@mui/icons-material';
import { analyticsService } from '../../services/analyticsService';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerNavigation from '../../components/common/Navigation';

const AIFeedback = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedStoreId) {
      loadAIFeedbacks();
    }
  }, [selectedStoreId]);

  const loadAIFeedbacks = async () => {
    try {
      setLoading(true);
      
      // 실제 AI 피드백 상세 데이터 로드
      const response = await analyticsService.getAIFeedbackDetail(selectedStoreId);
      console.log('AI 피드백 응답:', response);
      
      // 실제 데이터 구조에 맞게 처리
      if (response.data) {
        // 하나의 피드백 객체인 경우 배열로 변환
        const feedbackData = Array.isArray(response.data) ? response.data : [response.data];
        setFeedbacks(feedbackData);
      } else {
        setFeedbacks([]);
      }
      
    } catch (error) {
      console.error('AI 피드백 로드 실패:', error);
      setError('AI 피드백을 불러오는데 실패했습니다.');
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  // AI 피드백 상세보기 - feedbackId와 함께 네비게이션
  const handleFeedbackDetail = (feedbackId) => {
    navigate(`/owner/ai-feedback/detail/${feedbackId}`);
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mobile-container">
      {/* 헤더 */}
      <Box sx={{ 
        p: 2, 
        bgcolor: '#2c3e50', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <ArrowBack 
          onClick={() => navigate('/owner')}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            AI 피드백
          </Typography>
          <Typography variant="body2">
            AI 기반 매장 운영 개선 제안
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {error ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="error">
                {error}
              </Typography>
            </CardContent>
          </Card>
        ) : feedbacks.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Psychology sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                AI 피드백이 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                데이터가 충분히 수집되면 AI 피드백이 제공됩니다
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* AI 피드백 요약 */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  📊 이번 주 AI 분석 결과
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                        {feedbacks.length}
                      </Typography>
                      <Typography variant="caption">개선 제안</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                        {feedbacks.filter(f => f.priority === '높음').length}
                      </Typography>
                      <Typography variant="caption">높은 우선순위</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                        {feedbacks.filter(f => f.priority === '높음').length > 0 ? '85%' : '0%'}
                      </Typography>
                      <Typography variant="caption">예상 개선율</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* AI 피드백 목록 */}
            {feedbacks.map((feedback) => (
              <Card key={feedback.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {feedback.title}
                    </Typography>
                    <Chip 
                      label={feedback.priority} 
                      size="small" 
                      color={feedback.priority === '높음' ? 'error' : feedback.priority === '중간' ? 'warning' : 'default'}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {feedback.description}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    카테고리: {feedback.category} | 예상 효과: {feedback.expectedImpact}
                  </Typography>
                </CardContent>
              </Card>
            ))}

            {/* 더보기 버튼 - feedbackId와 함께 네비게이션 */}
            <Button
              fullWidth
              variant="contained"
              startIcon={<TrendingUp />}
              onClick={() => {
                // 실제 피드백 데이터가 있으면 해당 ID 사용, 없으면 기본값 사용
                const feedbackId = feedbacks.length > 0 && feedbacks[0].id 
                  ? feedbacks[0].id 
                  : feedbacks.length > 0 && feedbacks[0].feedbackId
                  ? feedbacks[0].feedbackId
                  : 1; // 기본값
                
                console.log('네비게이션할 feedbackId:', feedbackId);
                console.log('현재 feedbacks:', feedbacks);
                
                handleFeedbackDetail(feedbackId);
              }}
              sx={{ mt: 2, mb: 2 }}
            >
              상세 AI 피드백 및 실행 계획 보기
            </Button>
          </>
        )}
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default AIFeedback;