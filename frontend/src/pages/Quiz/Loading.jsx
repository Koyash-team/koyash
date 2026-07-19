import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loading.css';
import Stage from './Stage';
import logo from '../../assets/landing/logo.webp';
import sceneLoading from '../../assets/quiz/scene-loading.webp';
import { buildRequest } from './quizConfig';
import { getToken, saveGuestBagRequest, clearGuestBagRequest } from '../../api/client';

const LOADING_STEPS = [
  'Смотрю, что подойдёт именно тебе...',
  'Проверяю составы...',
  'Убираю лишнее...',
  'Собираю косметичку...',
  'Почти готово, солнышко...',
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Loading({ answers }) {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    let cancelled = false;
    const timers = [];

    LOADING_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          setProgress(Math.round(((i + 1) / LOADING_STEPS.length) * 80) + 8);
        }, i * 650),
      );
    });

    const request = buildRequest(answers);
    // Send the auth token when the visitor is signed in, so the backend
    // persists this bag/profile/tracker to their account (guest requests stay
    // anonymous and nothing is saved).
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      // Signed-in: the bag is saved directly — drop any stale guest stash.
      clearGuestBagRequest();
    } else {
      // Guest: stash the request so it can be saved if they register/sign in
      // from the results offer.
      saveGuestBagRequest(request);
    }
    fetch(`${API_URL}/recommend`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 422) {
            return res.json().then((data) => {
              if (data?.detail?.error?.code === 'NO_PRODUCTS_AVAILABLE') return { noResults: true };
              throw new Error('API error');
            });
          }
          throw new Error('API error');
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setProgress(100);
        timers.push(
          setTimeout(() => navigate('/results', { state: { results: data, answers } }), 550),
        );
      })
      .catch(() => {
        if (cancelled) return;
        navigate('/results', { state: { error: true, answers } });
      });

    // Clear pending timers and ignore late async resolutions on unmount, so a
    // fired timer never calls setState after teardown (the test-teardown flake).
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Stage>
      <div className="loadRoot">
        <img
          className="loadLogo"
          src={logo}
          alt="Koyash"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        <div className="loadTrack" />
        <div className="loadFill" style={{ width: `${(progress / 100) * 1307}px` }} />

        <span className="loadNote">
          Koyash собирает твои ответы в маленькие карточки и раскладывает их по столу.
        </span>
        <img className="loadScene" src={sceneLoading} alt="" aria-hidden="true" />
        <h1 className="loadTitle">Подбираю уход именно для тебя...</h1>

        <ul className="loadSteps">
          {LOADING_STEPS.map((text, i) => (
            <li
              key={i}
              className={`loadStep${i < visibleCount ? ' visible' : ''}${i < visibleCount - 1 ? ' done' : ''}`}
            >
              — {text}
            </li>
          ))}
        </ul>

        <div className="loadBarTrack">
          <div className="loadBarFill" style={{ width: `${(progress / 100) * 513}px` }} />
        </div>
        <span className="loadPercent">{progress}%</span>
      </div>
    </Stage>
  );
}
