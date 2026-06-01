import { Navbar, Nav, Container, Button, Row, Col } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router";
import { AuthButton } from "./Buttons";
import "../styles/App.css";

function AppNavbar({ loggedIn, user, handleLogout }) {
  const navigate = useNavigate();

  return (
    <Navbar>
      <Container fluid>
        <Row className="w-100 align-items-center">

          <Col xs={4} className="d-flex align-items-center">
            <Navbar.Brand>ultima corsa</Navbar.Brand>
          </Col>

          <Col xs={4} className="d-flex justify-content-center">
            <Nav className="gap-3">
              <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/instructions">Istruzioni</Nav.Link>
              {loggedIn && (<Nav.Link as={NavLink} to="/leaderboard">Classifica</Nav.Link>)}
            </Nav>
          </Col>

          <Col xs={4} className="d-flex justify-content-end align-items-center gap-3">
            {!loggedIn ? (
              <AuthButton onClick={() => navigate("/login")}>
                Login
              </AuthButton>
            ) : (
              <>
                <span className="navbar-user"> Ciao, <strong>{user?.name}</strong></span>
                <AuthButton onClick={handleLogout}>
                  Logout
                </AuthButton>
              </>
            )}
          </Col>

        </Row>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;