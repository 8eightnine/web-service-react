import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PhotoCard = ({ photo }) => {
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="photo-card">
      <Link to={`/photo/${photo.slug}`} className="photo-card-link text-decoration-none">
        <Card className="h-100">
          <div className="photo-card-image">
            <Card.Img
              variant="top"
              src={photo.image.url}
              alt={photo.title}
              loading="lazy"
              style={{ height: '200px', objectFit: 'cover' }}
            />
          </div>
          <Card.Body className="d-flex flex-column">
            <Card.Title as="h5" className="mb-2">
              {truncateText(photo.title, 30)}
            </Card.Title>
            
            <div className="photo-meta mt-auto">
              <div className="tags-container mb-2">
                {photo.tags.slice(0, 3).map(tag => (
                  <Badge key={tag.slug} bg="info" className="me-1">
                    {tag.name}
                  </Badge>
                ))}
                {photo.tags.length === 0 && (
                  <span className="text-muted small">Без тегов</span>
                )}
                {photo.tags.length > 3 && (
                  <Badge bg="secondary">+{photo.tags.length - 3}</Badge>
                )}
              </div>
              
              <div className="author-info">
                <Badge bg="primary" className="me-2">
                  {photo.category_type_display}
                </Badge>
                <small className="text-muted">
                  {new Date(photo.uploaded_at).toLocaleDateString('ru-RU')}
                </small>
              </div>
              
              <div className="author-info mt-1">
                <small className="text-muted">
                  {photo.uploaded_by ? photo.uploaded_by.username : 'Анонимный'}
                </small>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Link>
    </div>
  );
};

export default PhotoCard;
