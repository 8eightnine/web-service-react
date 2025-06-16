import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Navigation = () => {
  const isAuthenticated = false; // Мокированное состояние авторизации

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>📷 Фотогалерея</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/photos">
              <Nav.Link>Все фотографии</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/upload">
              <Nav.Link>Загрузить фото</Nav.Link>
            </LinkContainer>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <LinkContainer to="/profile">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Профиль
                  </Nav.Link>
                </LinkContainer>
                <Nav.Link href="/logout">
                  <i className="fas fa-sign-out-alt"></i> Выйти
                </Nav.Link>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-sign-in-alt"></i> Войти
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>
                    <i className="fas fa-user-plus"></i> Регистрация
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
