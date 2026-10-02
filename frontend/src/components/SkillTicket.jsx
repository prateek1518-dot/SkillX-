import "./SkillTicket.css";

// The recurring "trade ticket" visual: what someone offers on the left,
// what they want on the right, split by a swap mark in the middle —
// same shape a real barter voucher would take.
export default function SkillTicket({ listing, onRequest }) {
  const { user, offers, wants, rating, blurb } = listing;

  return (
    <div className="ticket skill-ticket">
      <div className="skill-ticket-top">
        <div>
          <p className="skill-ticket-user">{user}</p>
          <p className="skill-ticket-rating">★ {rating.toFixed(1)}</p>
        </div>
      </div>

      <div className="skill-ticket-trade">
        <div className="skill-ticket-side">
          <span className="eyebrow">Offers</span>
          <span className="tag">{offers}</span>
        </div>
        <div className="skill-ticket-swap">⇄</div>
        <div className="skill-ticket-side">
          <span className="eyebrow">Wants</span>
          <span className="tag tag-wants">{wants}</span>
        </div>
      </div>

      <p className="skill-ticket-blurb">{blurb}</p>

      <hr className="ticket-divider" />

      <button
        className="btn btn-primary btn-sm btn-block"
        onClick={() => onRequest?.(listing)}
      >
        Send exchange request
      </button>
    </div>
  );
}
