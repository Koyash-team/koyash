import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './account.css';
import Stage from '../Quiz/Stage';
import TopNav from './TopNav';
import ProfileCard from './ProfileCard';
import Footer from './Footer';
import AvatarPicker from './AvatarPicker';
import HowItWorks from './HowItWorks';
import ConfirmDialog from './ConfirmDialog';
import { useAuth } from '../../auth/useAuth';
import { fetchProfile, fetchCare, fetchTracker } from '../../api/client';
import { profileValues } from './labels';

import heart from '../../assets/account/offer-spot.png';
import decorCream from '../../assets/account/decor-cream.png';
import mascot from '../../assets/account/mascot.png';
import trkIllust from '../../assets/account/trk-illust.png';
import trkIc1 from '../../assets/account/trk-ic1.png';
import trkIc2 from '../../assets/account/trk-ic2.png';
import trkIc3 from '../../assets/account/trk-ic3.png';
import trkIc4 from '../../assets/account/trk-ic4.png';
import bagIllust from '../../assets/account/bag-illust.png';
import bagIcDate from '../../assets/account/pf-age.png';
import bagIcCount from '../../assets/account/bag-ic-date.png';
import bagIcTotal from '../../assets/account/bag-ic-count.png';
import introHeart from '../../assets/account/pf-pref.png';

// Small stat glyph, sized to the Figma box (w×h).
const StatIcon = ({ src, x, y, w = 34, h = 34 }) => (
  <span
    className="acAbs"
    aria-hidden="true"
    style={{
      left: x,
      top: y,
      width: w,
      height: h,
      backgroundImage: `url(${src})`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
    }}
  />
);

const MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function shortDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

const OVERALL = { better: 'Стало лучше', same: 'Без изменений', worse: 'Стало хуже' };
const WEEKS_TOTAL = 12;

// Derive the tracker headline (current week, last result, next checkpoint) once,
// at fetch time, so render stays pure (no Date.now() during render).
function summarizeTracker(tracker) {
  if (!tracker?.start_date) return null;
  const elapsed = (Date.now() - new Date(tracker.start_date).getTime()) / (7 * 864e5);
  const week = Math.max(0, Math.min(WEEKS_TOTAL, Math.floor(elapsed)));
  const cps = tracker.checkpoints || [];
  const filled = cps.filter((c) => c.overall);
  const lastResult = filled.length ? OVERALL[filled[filled.length - 1].overall] : null;
  const next = cps.find((c) => c.status !== 'done');
  return {
    week,
    lastResult,
    progressPct: (week / WEEKS_TOTAL) * 100,
    nextDate: next ? shortDate(next.due_date) : null,
  };
}

// Личный кабинет (Figma 2673:1165 «с подбором» / 2803:105 «без подбора»).
// Pulls the three optional snapshots — profile, saved bag and tracker — and
// falls back to the empty state for anything the guest-turned-user hasn't
// generated yet.
export default function Cabinet() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, ready, signOut } = useAuth();

  const [profile, setProfile] = useState(null);
  const [care, setCare] = useState(null);
  const [trackerSummary, setTrackerSummary] = useState(null);
  const [askUpdate, setAskUpdate] = useState(false);
  // Opened straight after registration (state.pickAvatar) or via the profile
  // avatar button — shown as a modal over the dimmed cabinet.
  const [showAvatar, setShowAvatar] = useState(!!location.state?.pickAvatar);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  useEffect(() => {
    if (ready && !isAuthenticated) navigate('/login', { replace: true });
  }, [ready, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    // Each snapshot is optional (404 before the questionnaire) — swallow errors.
    fetchProfile()
      .then(setProfile)
      .catch(() => {});
    fetchCare()
      .then(setCare)
      .catch(() => {});
    fetchTracker()
      .then((t) => setTrackerSummary(summarizeTracker(t)))
      .catch(() => {});
  }, [isAuthenticated]);

  const hasProfile = !!profile;

  const week = trackerSummary?.week ?? 0;
  const lastResult = trackerSummary?.lastResult;
  const progressPct = trackerSummary?.progressPct ?? 0;
  const nextDate = trackerSummary?.nextDate;

  // care summary
  const items = care?.items || [];
  const activeCount = items.filter((i) => i.status === 'active').length;
  const replacedCount = items.filter((i) => i.status === 'replaced').length;

  return (
    <>
    <Stage w={1633} h={1789} mode="screen">
      <div className="acCanvas" style={{ height: 1789 }}>
        <TopNav
          logoLeft={50}
          right={
            <button
              type="button"
              className="acBtn"
              style={{ left: 1298, top: 29, width: 281, height: 51, fontSize: 20 }}
              onClick={() => navigate('/')}
            >
              Вернуться на главную
            </button>
          }
        />

        <p
          className="acAbs acTitle"
          style={{ left: 614, top: 154, width: 405, fontSize: 48, lineHeight: '64px' }}
        >
          Личный кабинет
        </p>
        <img
          className="acAbs acHeart"
          src={heart}
          alt=""
          aria-hidden="true"
          style={{ left: 1024, top: 150, width: 72, height: 72 }}
        />

        <ProfileCard
          name={user?.name}
          email={user?.email}
          values={profileValues(profile)}
          hasProfile={hasProfile}
          avatar={user?.avatar}
          onAvatarClick={() => setShowAvatar(true)}
          onEdit={() => navigate('/account/security')}
          onLogout={() => {
            signOut();
            navigate('/', { replace: true });
          }}
          onHowItWorks={() => setShowHowItWorks(true)}
        />

        {/* ── Intro banner (Figma 2803:105 «Здесь собраны твой профиль…») ── */}
        <div
          className="acAbs"
          style={{
            left: 471,
            top: 291,
            width: 1102,
            height: 82,
            background: '#FDF3E9',
            borderRadius: 20,
          }}
        />
        <img
          className="acAbs"
          src={introHeart}
          alt=""
          aria-hidden="true"
          style={{ left: 498, top: 315, width: 34, height: 34 }}
        />
        <p
          className="acAbs acBody"
          style={{ left: 560, top: 313, width: 1000, fontWeight: 400, fontSize: 16, lineHeight: '22px' }}
        >
          Здесь собраны твой профиль, текущий уход и прогресс кожи. Следи за результатами и обновляй
          рекомендации, когда коже нужен новый подбор
        </p>

        {/* ── Tracker card ── */}
        <div className="acCard" style={{ left: 477, top: 416, width: 540, height: 701 }} />
        <p
          className="acAbs acTitle"
          style={{ left: 477, top: 451, width: 540, fontSize: 26, lineHeight: '35px' }}
        >
          Трекер результата
        </p>
        {hasProfile ? (
          <>
            <img
              className="acAbs"
              src={trkIllust}
              alt=""
              aria-hidden="true"
              style={{ left: 587, top: 492, width: 320, height: 256 }}
            />
            <StatIcon src={trkIc1} x={502} y={756} w={33} h={33} />
            <p
              className="acAbs"
              style={{
                left: 541,
                top: 756,
                width: 228,
                height: 33,
                display: 'flex',
                alignItems: 'center',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Неделя {week} из {WEEKS_TOTAL}
            </p>
            <div
              className="acAbs"
              style={{
                left: 499,
                top: 800,
                width: 500,
                height: 10,
                background: '#FDF3E9',
                borderRadius: 5,
              }}
            />
            <div
              className="acAbs"
              style={{
                left: 499,
                top: 800,
                width: 500 * (progressPct / 100),
                height: 10,
                background: '#D7863B',
                borderRadius: 5,
              }}
            />
            <div className="acCard" style={{ left: 511, top: 826, width: 225, height: 88 }} />
            <StatIcon src={trkIc2} x={524} y={841} w={52} h={54} />
            <p
              className="acAbs"
              style={{ left: 589, top: 840, width: 149, fontSize: 15, lineHeight: '20px' }}
            >
              Последний результат:
              <br />
              <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                {lastResult || 'Пока нет отметок'}
              </span>
            </p>
            <div className="acCard" style={{ left: 743, top: 826, width: 225, height: 88 }} />
            <StatIcon src={trkIc3} x={747} y={844} w={51} h={52} />
            <p
              className="acAbs"
              style={{ left: 807, top: 847, width: 155, fontSize: 15, lineHeight: '20px' }}
            >
              Частота отметок:
              <br />
              <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>1 раз в 2 недели</span>
            </p>
            <div className="acCard" style={{ left: 511, top: 925, width: 458, height: 88 }} />
            <StatIcon src={trkIc4} x={524} y={940} w={60} h={59} />
            <p
              className="acAbs"
              style={{ left: 624, top: 944, width: 330, fontSize: 16, lineHeight: '22px' }}
            >
              Следующая отметка результата:
              <br />
              <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{nextDate || '—'}</span>
            </p>
            <button
              type="button"
              className="acBtn"
              style={{ left: 596, top: 1038, width: 287, height: 51, fontSize: 20 }}
              onClick={() => navigate('/account/tracker')}
            >
              Перейти к трекеру
            </button>
          </>
        ) : (
          <>
            <img
              className="acAbs"
              src={trkIllust}
              alt=""
              aria-hidden="true"
              style={{ left: 526, top: 505, width: 434, height: 357 }}
            />
            <p
              className="acAbs acTitle"
              style={{
                left: 477,
                top: 890,
                width: 540,
                fontSize: 28,
                lineHeight: '37px',
                whiteSpace: 'normal',
              }}
            >
              Пока нет данных для отслеживания
            </p>
            <p
              className="acAbs acBody"
              style={{ left: 517, top: 985, width: 460, textAlign: 'center' }}
            >
              Пройди подбор уходовой косметики, чтобы начать трекер результата
            </p>
          </>
        )}

        {/* ── Cosmetic bag card ── */}
        <div className="acCard" style={{ left: 1045, top: 416, width: 534, height: 701 }} />
        <p
          className="acAbs acTitle"
          style={{ left: 1045, top: 451, width: 534, fontSize: 26, lineHeight: '35px' }}
        >
          Моя косметичка
        </p>
        {care ? (
          <>
            <img
              className="acAbs"
              src={bagIllust}
              alt=""
              aria-hidden="true"
              style={{ left: 1090, top: 496, width: 440, height: 210 }}
            />
            <div className="acCard" style={{ left: 1130, top: 751, width: 382, height: 72 }} />
            <StatIcon src={bagIcDate} x={1158} y={763} w={50} h={47} />
            <p
              className="acAbs"
              style={{
                left: 1231,
                top: 759,
                width: 228,
                fontWeight: 600,
                fontSize: 20,
                lineHeight: '27px',
              }}
            >
              Обновлено
              <br />
              <span style={{ fontWeight: 400 }}>{formatDate(care.updated_at)}</span>
            </p>
            <div className="acCard" style={{ left: 1130, top: 843, width: 382, height: 72 }} />
            <StatIcon src={bagIcCount} x={1171} y={851} w={24} h={55} />
            <p
              className="acAbs"
              style={{
                left: 1231,
                top: 851,
                width: 228,
                fontWeight: 600,
                fontSize: 20,
                lineHeight: '27px',
              }}
            >
              Средств в уходе:
              <br />
              <span style={{ fontWeight: 400 }}>{activeCount}</span>
            </p>
            <div className="acCard" style={{ left: 1130, top: 935, width: 382, height: 72 }} />
            <StatIcon src={bagIcTotal} x={1150} y={946} w={65} h={51} />
            <p
              className="acAbs"
              style={{
                left: 1231,
                top: 944,
                width: 228,
                fontWeight: 600,
                fontSize: 20,
                lineHeight: '27px',
              }}
            >
              Средств заменено:
              <br />
              <span style={{ fontWeight: 400 }}>{replacedCount}</span>
            </p>
            <button
              type="button"
              className="acBtn"
              style={{ left: 1140, top: 1038, width: 344, height: 51, fontSize: 20 }}
              onClick={() => navigate('/account/care')}
            >
              Перейти к косметичке
            </button>
          </>
        ) : (
          <>
            <p
              className="acAbs acTitle"
              style={{
                left: 1045,
                top: 890,
                width: 534,
                fontSize: 28,
                lineHeight: '37px',
                whiteSpace: 'normal',
              }}
            >
              Косметичка пока пуста
            </p>
            <img
              className="acAbs"
              src={bagIllust}
              alt=""
              aria-hidden="true"
              style={{ left: 1057, top: 505, width: 501, height: 334 }}
            />
            <p
              className="acAbs acBody"
              style={{ left: 1085, top: 985, width: 454, textAlign: 'center' }}
            >
              После подбора уходовой косметики здесь появятся твои средства
            </p>
          </>
        )}

        {/* ── Update-care banner ── */}
        <div
          className="acAbs"
          style={{
            left: 474,
            top: 1150,
            width: 1109,
            height: 187,
            background: '#FDF3E9',
            borderRadius: 20,
          }}
        />
        <img
          className="acAbs"
          src={decorCream}
          alt=""
          aria-hidden="true"
          style={{ left: 498, top: 1157, width: 174, height: 174 }}
        />
        <img
          className="acAbs"
          src={mascot}
          alt=""
          aria-hidden="true"
          style={{ left: 1367, top: 1159, width: 186, height: 186 }}
        />
        {hasProfile ? (
          <>
            <p
              className="acAbs acTitle"
              style={{
                left: 726,
                top: 1170,
                width: 456,
                fontSize: 28,
                lineHeight: '37px',
                textAlign: 'left',
              }}
            >
              Хочешь пересмотреть уход?
            </p>
            <p
              className="acAbs acBody"
              style={{ left: 726, top: 1220, width: 481, textAlign: 'left', fontSize: 16 }}
            >
              Мы обновим рекомендации под твои текущие потребности.
            </p>
          </>
        ) : (
          <p
            className="acAbs"
            style={{
              left: 680,
              top: 1186,
              width: 680,
              textAlign: 'center',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 30,
              lineHeight: '40px',
              color: '#634938',
            }}
          >
            Давай начнём твою историю о мире уходовой косметики!
          </p>
        )}
        <button
          type="button"
          className="acBtn"
          style={{ left: 726, top: 1272, width: 281, height: 45, fontSize: 20 }}
          onClick={() => (hasProfile ? setAskUpdate(true) : navigate('/quick'))}
        >
          Подобрать уход
        </button>
        <button
          type="button"
          className="acBtn"
          style={{ left: 1034, top: 1272, width: 281, height: 45, fontSize: 20 }}
          onClick={() => navigate('/quiz')}
        >
          Войти в историю
        </button>

        <Footer />

        {askUpdate && (
          <ConfirmDialog
            title="Точно хочешь обновить уход?"
            message="Текущий уход будет удалён"
            confirmLabel="Обновить"
            onConfirm={() => navigate('/quick')}
            onCancel={() => setAskUpdate(false)}
          />
        )}
      </div>
    </Stage>
    {/* Avatar picker overlays the (dimmed) cabinet — rendered outside <Stage>
        so its fixed-position overlay isn't affected by the stage transform. */}
    {showAvatar && <AvatarPicker onClose={() => setShowAvatar(false)} />}
    {showHowItWorks && <HowItWorks onClose={() => setShowHowItWorks(false)} />}
    </>
  );
}
