import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './account.css';
import Stage from '../Quiz/Stage';
import TopNav from './TopNav';
import ProductCard from './ProductCard';
import ConfirmDialog from './ConfirmDialog';
import { useAuth } from '../../auth/useAuth';
import { fetchCare, fetchAlternatives, replaceItem } from '../../api/client';
import heart from '../../assets/account/offer-spot.png';

// Замена средства (Figma 2842:31) + «Замен не нашлось» (2844:109).
// Lists similar products for a disliked item (GET alternatives) and swaps the
// chosen one in (POST replace). Rendered either as a standalone route
// (/account/care/replace/:id) or, preferably, as a modal over the dimmed bag
// (`embedId` + `onClose`/`onReplaced`).
export default function Replace({ embedId, onClose, onReplaced }) {
  const navigate = useNavigate();
  const params = useParams();
  const id = embedId || params.id;
  const embedded = !!embedId;
  const { isAuthenticated, ready } = useAuth();

  const [current, setCurrent] = useState(null);
  const [alternatives, setAlternatives] = useState(null);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [noneLeft, setNoneLeft] = useState(false);

  useEffect(() => {
    if (!embedded && ready && !isAuthenticated) navigate('/login', { replace: true });
  }, [embedded, ready, isAuthenticated, navigate]);

  useEffect(() => {
    if (!embedded && !isAuthenticated) return;
    fetchCare()
      .then((care) => setCurrent((care.items || []).find((i) => i.product.id === id) || null))
      .catch(() => {});
    fetchAlternatives(id)
      .then((res) => {
        setAlternatives(res.alternatives || []);
        if (!res.alternatives || res.alternatives.length === 0) setNoneLeft(true);
      })
      .catch(() => {
        setAlternatives([]);
        setNoneLeft(true);
      });
  }, [embedded, isAuthenticated, id]);

  const back = () => (embedded ? onClose?.() : navigate('/account/care'));

  async function save() {
    if (!selected) return;
    setBusy(true);
    try {
      await replaceItem(id, selected);
      if (embedded) onReplaced?.();
      else navigate('/account/care', { replace: true });
    } catch {
      setBusy(false);
    }
  }

  // Similar-product cards: the «Выбрать» control sits below each card.
  const alts = (alternatives || []).map((p) => (
    <ProductCard
      key={p.id}
      item={{ product: p, justification: p.justification || {} }}
      below={
        <button
          type="button"
          className={`acBtn acModalBtn${selected === p.id ? ' acBtnGhost' : ''}`}
          style={{ width: 180 }}
          onClick={() => setSelected(p.id)}
        >
          {selected === p.id ? 'Выбрано' : 'Выбрать'}
        </button>
      }
    />
  ));

  // Shared body (current item + similar products), used in both modes.
  const body = (
    <>
      <p className="acBody" style={{ textAlign: 'center', margin: '0 0 6px' }}>
        Мы учли твой тип кожи, все особенности и бюджет. Вот средства, которые могут подойти
      </p>
      <p className="careHint" style={{ textAlign: 'center', margin: '0 0 18px' }}>
        ✦ Выбрать можно только одно средство
      </p>

      {current && (
        <>
          <p className="careStep" style={{ margin: '10px 0 8px', fontWeight: 600 }}>
            Текущее средство
          </p>
          <ProductCard item={current} dimmed />
        </>
      )}

      <p className="careStep" style={{ margin: '20px 0 8px', fontWeight: 600 }}>
        Похожие средства
      </p>
      {alts}
      {alternatives && alternatives.length === 0 && !noneLeft && (
        <p className="acBody" style={{ textAlign: 'center', padding: '40px 0' }}>
          Загружаем…
        </p>
      )}
    </>
  );

  const noneDialog = noneLeft && (
    <ConfirmDialog
      title="Замен не нашлось"
      message="Извини, но замен с учётом твоих предпочтений не нашлось."
      confirmLabel="Назад"
      cancelLabel="Закрыть"
      onConfirm={back}
      onCancel={back}
    />
  );

  // ── Modal over the dimmed cosmetic bag ──────────────────────────────────
  if (embedded) {
    return (
      <div
        className="acModalOverlay"
        style={{ overflowY: 'auto', alignItems: 'flex-start', padding: '30px 12px' }}
        onClick={back}
      >
        <div className="replaceModal" onClick={(e) => e.stopPropagation()}>
          <p
            className="acModalTitle"
            style={{
              fontSize: 30,
              lineHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            Подходящие замены
            <img
              className="acHeart"
              src={heart}
              alt=""
              aria-hidden="true"
              style={{ width: 40, height: 40, objectFit: 'contain' }}
            />
          </p>
          {body}
          <div className="acModalActions" style={{ gap: 40, marginTop: 18 }}>
            <button
              type="button"
              className="acBtn acBtnGhost acModalBtn"
              style={{ width: 200 }}
              onClick={back}
            >
              Назад
            </button>
            <button
              type="button"
              className="acBtn acModalBtn"
              style={{ width: 260 }}
              onClick={save}
              disabled={busy || !selected}
            >
              Сохранить изменения
            </button>
          </div>
        </div>
        {noneDialog}
      </div>
    );
  }

  // ── Standalone route (Stage page) ───────────────────────────────────────
  const rightNav = (
    <button
      type="button"
      className="acBtn"
      style={{ left: 1301, top: 23, width: 281, height: 51, fontSize: 20 }}
      onClick={() => navigate('/account/care')}
    >
      Вернуться в профиль
    </button>
  );

  return (
    <Stage w={1633} mode="page">
      <div className="acCanvas" style={{ width: 1633 }}>
        <div style={{ position: 'relative', height: 205 }}>
          <TopNav right={rightNav} />
          <p
            className="acAbs acTitle"
            style={{ left: 0, top: 150, width: 1633, fontSize: 40, lineHeight: '52px' }}
          >
            Подходящие замены
          </p>
          <img
            className="acAbs acHeart"
            src={heart}
            alt=""
            aria-hidden="true"
            style={{ left: 1035, top: 152, width: 50, height: 50 }}
          />
        </div>

        <div className="careList">{body}</div>

        <div className="careFootRow">
          <button
            type="button"
            className="acBtn acBtnGhost acModalBtn"
            style={{ width: 200 }}
            onClick={back}
          >
            Назад
          </button>
          <button
            type="button"
            className="acBtn acModalBtn"
            style={{ width: 325, marginLeft: 'auto' }}
            onClick={save}
            disabled={busy || !selected}
          >
            Сохранить изменения
          </button>
        </div>

        {noneDialog}
      </div>
    </Stage>
  );
}
