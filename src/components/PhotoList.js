import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PhotoCard from './PhotoCard';

const PhotoList = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category_type: '',
    sort: '-uploaded_at'
  });
  
  const photosPerPage = 12;
  const categories = ['nature', 'portrait', 'landscape', 'street', 'macro', 'other'];
  
  // Мокированные данные для демонстрации
  const mockPhotos = [
    {
      id: 1,
      slug: 'photo-1',
      title: 'Красивый закат',
      description: 'Удивительный закат над морем',
      image: { url: 'https://lh3.googleusercontent.com/proxy/l2jRtfhKlX6FMj_HnNx_ku2bFg8BndYOuR4mFRl8htNacOQSmjSoalS-YfdPxbgQTFb6jY7q7ptq3BsWts0IcB-Kif6tdtxnaxREWw' },
      category_type: 'nature',
      category_type_display: 'Природа',
      uploaded_at: '2024-01-15T10:30:00Z',
      uploaded_by: { username: 'photographer1' },
      tags: [
        { name: 'закат', slug: 'sunset' },
        { name: 'море', slug: 'sea' }
      ]
    },
    {
      id: 2,
      slug: 'photo-2',
      title: 'Портрет девушки',
      description: 'Красивый портрет в студии',
      image: { url: 'https://inside-studios.ru/wp-content/uploads/2023/09/Inside-9-5-682x1024-optimized.jpg' },
      category_type: 'portrait',
      category_type_display: 'Портрет',
      uploaded_at: '2024-01-14T15:20:00Z',
      uploaded_by: { username: 'photographer2' },
      tags: [
        { name: 'портрет', slug: 'portrait' },
        { name: 'студия', slug: 'studio' }
      ]
    }
  ];

  useEffect(() => {
    fetchPhotos();
  }, [filters]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setPhotos(mockPhotos);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Ошибка загрузки фотографий');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchPhotos();
  };

  // Мемоизированная сортировка и фильтрация
  const filteredAndSortedPhotos = useMemo(() => {
    let filtered = [...photos];
    
    // Фильтрация по категории
    if (filters.category_type) {
      filtered = filtered.filter(photo => photo.category_type === filters.category_type);
    }
    
    // Сортировка
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case '-uploaded_at':
          return new Date(b.uploaded_at) - new Date(a.uploaded_at);
        case 'uploaded_at':
          return new Date(a.uploaded_at) - new Date(b.uploaded_at);
        case 'title':
          return a.title.localeCompare(b.title);
        case '-title':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [photos, filters]);

  const currentPhotos = filteredAndSortedPhotos.slice(
    (currentPage - 1) * photosPerPage,
    currentPage * photosPerPage
  );

  const stats = {
    total_photos: photos.length,
    latest_photo: photos.length > 0 ? photos[0] : null
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <Row>
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Все фотографии</h1>
            <Link to="/upload" className="btn btn-success">
              <i className="fas fa-plus"></i> Добавить фото
            </Link>
          </div>

          {/* Фильтры и сортировка */}
          <div className="filters mb-4">
            <Form onSubmit={handleApplyFilters}>
              <Row className="g-3">
                <Col md={3}>
                  <Form.Select
                    name="category_type"
                    value={filters.category_type}
                    onChange={handleFilterChange}
                  >
                    <option value="">Все категории</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'nature' ? 'Природа' :
                         category === 'portrait' ? 'Портрет' :
                         category === 'landscape' ? 'Пейзаж' :
                         category === 'street' ? 'Уличная' :
                         category === 'macro' ? 'Макро' : 'Другое'}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                  >
                    <option value="-uploaded_at">Новые первыми</option>
                    <option value="uploaded_at">Старые первыми</option>
                    <option value="title">По названию А-Я</option>
                    <option value="-title">По названию Я-А</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button type="submit" variant="primary">
                    Применить
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>

          {/* Сетка фотографий */}
          <div className="photos-table-container">
            {currentPhotos.length > 0 ? (
              <div className="photo-grid">
                {currentPhotos.map(photo => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
            ) : (
              <div className="empty-state text-center py-5">
                <div className="empty-state-icon" style={{ fontSize: '4rem' }}>📷</div>
                <h3>Фотографии не найдены</h3>
                <p>
                  Попробуйте изменить фильтры или{' '}
                  <Link to="/upload">загрузить первую фотографию</Link>.
                </p>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PhotoList;
