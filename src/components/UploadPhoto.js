import { useState } from 'react';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UploadPhoto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    category_type: '',
    tags: '',
    is_featured: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'nature', label: 'Природа' },
    { value: 'portrait', label: 'Портрет' },
    { value: 'landscape', label: 'Пейзаж' },
    { value: 'street', label: 'Уличная' },
    { value: 'macro', label: 'Макро' },
    { value: 'other', label: 'Другое' }
  ];

  // Валидация полей
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Название обязательно для заполнения';
        } else if (value.length < 3) {
          newErrors.title = 'Название должно содержать минимум 3 символа';
        } else if (value.length > 200) {
          newErrors.title = 'Название не должно превышать 200 символов';
        } else {
          delete newErrors.title;
        }
        break;

      case 'description':
        if (value.length > 1000) {
          newErrors.description = 'Описание не должно превышать 1000 символов';
        } else {
          delete newErrors.description;
        }
        break;

      case 'image':
        if (!value) {
          newErrors.image = 'Изображение обязательно для загрузки';
        } else {
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
          if (!allowedTypes.includes(value.type)) {
            newErrors.image = 'Разрешены только файлы JPEG, PNG и GIF';
          } else if (value.size > 10 * 1024 * 1024) { // 10MB
            newErrors.image = 'Размер файла не должен превышать 10MB';
          } else {
            delete newErrors.image;
          }
        }
        break;

      case 'category_type':
        if (!value) {
          newErrors.category_type = 'Выберите категорию';
        } else {
          delete newErrors.category_type;
        }
        break;

      case 'tags':
        if (value) {
          const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
          if (tags.length > 10) {
            newErrors.tags = 'Максимум 10 тегов';
          } else if (tags.some(tag => tag.length > 50)) {
            newErrors.tags = 'Каждый тег не должен превышать 50 символов';
          } else {
            delete newErrors.tags;
          }
        } else {
          delete newErrors.tags;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue;

    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'file') {
      newValue = files[0] || null;
    } else {
      newValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Валидация при изменении
    validateField(name, newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Валидация всех полей
    let isValid = true;
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Имитация успешной загрузки
      setTimeout(() => {
        navigate('/photos');
      }, 1000);

    } catch (error) {
      setErrors({ submit: 'Ошибка при загрузке фотографии' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Col md={8} className="mx-auto">
        <div className="upload-container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Загрузить фотографию</h1>
          </div>

          {errors.submit && (
            <Alert variant="danger">{errors.submit}</Alert>
          )}

          <Form onSubmit={handleSubmit} noValidate>
            {/* Поле изображения */}
            <Form.Group className="mb-3">
              <Form.Label>
                Изображение <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                isInvalid={!!errors.image}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.image}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Разрешены файлы JPEG, PNG, GIF. Максимальный размер: 10MB
              </Form.Text>
            </Form.Group>

            {/* Поле названия */}
            <Form.Group className="mb-3 title-field">
              <Form.Label>
                Название <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                isInvalid={!!errors.title}
                placeholder="Введите название фотографии"
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Поле описания */}
            <Form.Group className="mb-3 description-field">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                isInvalid={!!errors.description}
                placeholder="Опишите вашу фотографию"
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Поле категории */}
            <Form.Group className="mb-3 category-field">
              <Form.Label>
                Категория <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="category_type"
                value={formData.category_type}
                onChange={handleInputChange}
                isInvalid={!!errors.category_type}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.category_type}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Поле тегов */}
            <Form.Group className="mb-3 tags-field">
              <Form.Label>Теги</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                isInvalid={!!errors.tags}
                placeholder="Введите теги через запятую"
              />
              <Form.Control.Feedback type="invalid">
                {errors.tags}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Разделяйте теги запятыми. Максимум 10 тегов.
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button
                variant="secondary"
                onClick={() => navigate('/photos')}
                className="me-md-2"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="success"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload"></i> Опубликовать
                  </>
                )}
              </Button>
            </div>
          </Form>
        </div>
      </Col>
    </div>
  );
};

export default UploadPhoto;
