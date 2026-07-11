import { useNavigate } from 'react-router-dom';
import logo from '../../assets/landing/logo.png';

// Shared header for the account / auth screens. Matches the landing header
// (logo + three section links) and exposes the right-hand slot so each screen
// can drop in its own primary action ("Подобрать уход", the user's name, …).
// Coordinates are the raw Figma values on the 1633px canvas.
export default function TopNav({ right }) {
  const navigate = useNavigate();

  return (
    <>
      <img
        className="acAbs"
        src={logo}
        alt="Koyash"
        style={{ left: 182, top: -12, width: 233, height: 194, cursor: 'pointer' }}
        onClick={() => navigate('/')}
      />
      <button
        type="button"
        className="acAbs acNav"
        style={{ left: 509, top: 48 }}
        onClick={() => navigate('/')}
      >
        О нас
      </button>
      <button
        type="button"
        className="acAbs acNav"
        style={{ left: 631, top: 48 }}
        onClick={() => navigate('/')}
      >
        Как это работает?
      </button>
      <button
        type="button"
        className="acAbs acNav"
        style={{ left: 853, top: 48 }}
        onClick={() => navigate('/')}
      >
        Забота и Доверие
      </button>

      {right ?? (
        <button
          type="button"
          className="acBtn"
          style={{ left: 1197, top: 41, width: 281, height: 51, fontSize: 20 }}
          onClick={() => navigate('/quiz')}
        >
          Подобрать уход
        </button>
      )}
    </>
  );
}
