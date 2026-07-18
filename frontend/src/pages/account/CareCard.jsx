import { useState } from 'react';
import ProductCard from './ProductCard';
import heartFilled from '../../assets/account/pf-pref.png';

// One product in the bag with its feedback controls (Figma 2673:1259).
// - "Подошло"   → PUT feedback liked
// - "Не подошло" → reveal a required comment box → PUT feedback disliked
// - once disliked, offer a replacement while the step still has swaps left
export default function CareCard({ item, replacementsLeft, busy, onFeedback, onReplace }) {
  const feedback = item.feedback; // 'liked' | 'disliked' | null
  const isReplaced = item.status === 'replaced';
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState(item.comment || '');

  function like() {
    setCommenting(false);
    onFeedback(item, { feedback: 'liked' });
  }

  function submitDislike() {
    if (!comment.trim()) return;
    onFeedback(item, { feedback: 'disliked', comment: comment.trim() });
    setCommenting(false);
  }

  const side = (
    <>
      <div className="careFbRow">
        <button
          type="button"
          className={`careFbBtn${feedback === 'liked' ? ' active' : ''}`}
          onClick={like}
          disabled={busy}
        >
          Подошло
        </button>
        <button
          type="button"
          className={`careFbBtn${feedback === 'disliked' ? ' active' : ''}`}
          onClick={() => setCommenting(true)}
          disabled={busy}
        >
          Не подошло
        </button>
      </div>

      {commenting && feedback !== 'disliked' && (
        <>
          <p className="careFbLabel">Что именно не так?</p>
          <textarea
            className="careComment"
            placeholder="Комментарий"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="button"
            className="acBtn acModalBtn careSubmit"
            onClick={submitDislike}
            disabled={busy || !comment.trim()}
          >
            Отправить
          </button>
        </>
      )}

      {feedback === 'disliked' && (
        <>
          {item.comment && <div className="careCommentBox">{item.comment}</div>}

          {isReplaced ? (
            // Replaced product: «Отправлен» → «Спасибо за отзыв!» → heart, centered
            <div className="careReplacedFb">
              <span className="careSent">Отправлен</span>
              <p className="careThanksCenter">Спасибо за отзыв!</p>
              <img className="careReplacedHeart" src={heartFilled} alt="" aria-hidden="true" />
            </div>
          ) : (
            <>
              <div className="careThanksRow">
                <span className="careThanks">Спасибо за отзыв!</span>
                <span className="careSent">Отправлен</span>
              </div>
              {replacementsLeft > 0 ? (
                <>
                  <button
                    type="button"
                    className="careReplaceLink"
                    onClick={() => onReplace(item)}
                    disabled={busy}
                  >
                    Заменить на похожий продукт
                  </button>
                  <span className="careHint">
                    <span className="careSpark" aria-hidden="true">
                      ✦
                    </span>
                    Можно заменить: {replacementsLeft}&nbsp;
                    {replacementsLeft === 1 ? 'раз' : 'раза'}
                  </span>
                </>
              ) : (
                <div className="careLimit">
                  <span>Извини, но средство больше нельзя заменить, лимит закончился</span>
                  <img
                    className="careLimitHeart"
                    src={heartFilled}
                    alt=""
                    aria-hidden="true"
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );

  return <ProductCard item={item} side={side} dimmed={isReplaced} />;
}
