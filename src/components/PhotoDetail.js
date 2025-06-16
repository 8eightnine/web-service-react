import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Badge, Button, Form, Alert, Card } from 'react-bootstrap';

const PhotoDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedPhotos, setRelatedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isAuthenticated] = useState(false); // Мокированное состояние авторизации

  // Мокированные данные
  const mockPhoto = {
    id: 1,
    slug: 'photo-1',
    title: 'Красивый закат над морем',
    description: 'Удивительный закат, снятый на побережье Черного моря. Это фото было сделано во время золотого часа, когда солнце создает невероятные цвета на небе.',
    image: { url: 'https://lh3.googleusercontent.com/proxy/l2jRtfhKlX6FMj_HnNx_ku2bFg8BndYOuR4mFRl8htNacOQSmjSoalS-YfdPxbgQTFb6jY7q7ptq3BsWts0IcB-Kif6tdtxnaxREWw' },
    category: { name: 'Природа', slug: 'nature' },
    category_type: 'nature',
    category_type_display: 'Природа',
    uploaded_at: '2024-01-15T18:30:00Z',
    uploaded_by: { username: 'photographer1' },
    tags: [
      { name: 'закат', slug: 'sunset' },
      { name: 'море', slug: 'sea' },
      { name: 'природа', slug: 'nature' }
    ]
  };

  const mockComments = [
    {
      id: 1,
      text: 'Потрясающий снимок! Очень красивые цвета.',
      user: { username: 'user1' },
      created_at: '2024-01-16T10:00:00Z'
    },
    {
      id: 2,
      text: 'Великолепная композиция. Где это снято?',
      user: { username: 'user2' },
      created_at: '2024-01-16T14:30:00Z'
    }
  ];

  const mockRelatedPhotos = [
    {
      id: 2,
      slug: 'photo-2',
      title: 'Морской пейзаж',
      image: { url: 'https://via.placeholder.com/200x150' }
    },
    {
      id: 3,
      slug: 'photo-3',
      title: 'Закат в горах',
      image: { url: 'https://via.placeholder.com/200x150' }
    }
  ];

  useEffect(() => {
    fetchPhotoDetail();
  }, [slug]);

  const fetchPhotoDetail = async () => {
    setLoading(true);
    try {
      
      // Имитация API вызова
      setTimeout(() => {
        setPhoto(mockPhoto);
        setComments(mockComments);
        setRelatedPhotos(mockRelatedPhotos);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Ошибка загрузки фотографии');
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      // Имитация добавления комментария
      const newComment = {
        id: comments.length + 1,
        text: commentText,
        user: { username: 'current_user' },
        created_at: new Date().toISOString()
      };

      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (err) {
      setError('Ошибка при добавлении комментария');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту фотографию?')) {
      // Здесь должен быть реальный API вызов для удаления
      navigate('/photos');
    }
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

  if (!photo) {
    return <Alert variant="warning">Фотография не найдена</Alert>;
  }

  return (
    <div className="container">
      <div className="photo-detail-card">
        <h1 className="photo-title mb-4">{photo.title}</h1>
        
        <div className="photo-image mb-4">
          <img
            src={photo.image.url}
            alt={photo.title}
            className="img-fluid rounded"
            style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }}
          />
        </div>

        <Row>
          <Col md={8}>
            <div className="photo-info">
              <div className="upload-info mb-3">
                <p className="mb-1">
                  <strong>Загружено пользователем:</strong>{' '}
                  <Link to={`/user/${photo.uploaded_by.username}`}>
                    {photo.uploaded_by.username}
                  </Link>
                </p>
                <p className="mb-0">
                  <strong>Дата загрузки:</strong>{' '}
                  {new Date(photo.uploaded_at).toLocaleString('ru-RU')}
                </p>
              </div>

              {/* Кнопки действий для владельца или администратора */}
              {isAuthenticated && (
                <div className="photo-actions mb-4">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    as={Link}
                    to={`/photo/${photo.slug}/edit`}
                  >
                    <i className="fas fa-edit"></i> Редактировать
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <i className="fas fa-trash"></i> Удалить
                  </Button>
                </div>
              )}

              <div className="photo-description mb-4">
                <h3>Описание:</h3>
                <p>{photo.description}</p>
              </div>

              {/* Секция тегов */}
              <div className="photo-tags mb-4">
                <h3>Теги:</h3>
                <div className="tag-list">
                  {photo.tags.length > 0 ? (
                    photo.tags.map(tag => (
                      <Link
                        key={tag.slug}
                        to={`/photos/tag/${tag.slug}`}
                        className="text-decoration-none me-2"
                      >
                        <Badge bg="info" className="tag-badge">
                          {tag.name}
                        </Badge>
                      </Link>
                    ))
                  ) : (
                    <p>Нет тегов</p>
                  )}
                </div>
              </div>

              {/* Информация о категории */}
              <div className="photo-category mb-4">
                <h3>Категория:</h3>
                {photo.category ? (
                  <Link
                    to={`/photos/category/${photo.category.slug}`}
                    className="text-decoration-none me-2"
                  >
                    <Badge bg="primary" className="category-badge">
                      {photo.category.name}
                    </Badge>
                  </Link>
                ) : (
                  <span>Без категории</span>
                )}
                <Badge bg="secondary" className="ms-2">
                  {photo.category_type_display}
                </Badge>
              </div>

              {/* Навигация между фотографиями */}
              <div className="photo-navigation mb-4">
                <div className="d-flex justify-content-between">
                  <Button variant="outline-secondary" disabled>
                    ← Предыдущая
                  </Button>
                  <Button variant="outline-secondary" disabled>
                    Следующая →
                  </Button>
                </div>
              </div>
            </div>
          </Col>

          <Col md={4}>
            {/* Похожие фотографии */}
            {relatedPhotos.length > 0 && (
              <div className="related-photos mb-4">
                <h3>Похожие фотографии:</h3>
                <div className="related-photos-grid">
                  {relatedPhotos.map(related => (
                    <Card key={related.id} className="mb-2">
                      <Link
                        to={`/photo/${related.slug}`}
                        className="text-decoration-none"
                      >
                        <Card.Img
                          variant="top"
                          src={related.image.url}
                          alt={related.title}
                          style={{ height: '120px', objectFit: 'cover' }}
                        />
                        <Card.Body className="py-2">
                          <Card.Text className="mb-0 small">
                            {related.title.length > 20
                              ? related.title.substring(0, 20) + '...'
                              : related.title}
                          </Card.Text>
                        </Card.Body>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Col>
        </Row>

        {/* Секция комментариев */}
        <div className="comments-section mt-5">
          <h3>Комментарии ({comments.length}):</h3>

          {/* Форма комментария */}
          {isAuthenticated ? (
            <div className="comment-form mb-4">
              <h4>Добавить комментарий:</h4>
              <Form onSubmit={handleCommentSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Напишите ваш комментарий..."
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary">
                  Отправить
                </Button>
              </Form>
            </div>
          ) : (
            <p>
              <Link to="/login">Войдите</Link>, чтобы оставить комментарий.
            </p>
          )}

          {/* Список комментариев */}
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map(comment => (
                <Card key={comment.id} className="mb-3">
                  <Card.Body>
                    <div className="comment-header d-flex justify-content-between mb-2">
                      <strong>{comment.user.username}</strong>
                      <small className="text-muted">
                        {new Date(comment.created_at).toLocaleString('ru-RU')}
                      </small>
                    </div>
                    <div className="comment-body">
                      {comment.text}
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>Нет комментариев. Будьте первым!</p>
            )}
          </div>
        </div>

        <div className="back-link mt-4">
          <Link to="/photos" className="btn btn-secondary">
            ← Назад к списку фотографий
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
