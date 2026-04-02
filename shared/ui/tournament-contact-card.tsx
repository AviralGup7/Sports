import type { Tournament } from "@/domain";

type TournamentContactCardProps = {
  tournament: Tournament;
};

export function TournamentContactCard({ tournament }: TournamentContactCardProps) {
  return (
    <section className="home-contact-card" aria-label="Organising committee contacts">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Contacts</p>
          <h2>Organising committee</h2>
        </div>
      </div>
      <div className="home-contact-grid">
        {tournament.contacts.map((contact) => (
          <a key={contact.id} href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="home-contact-person">
            <span className="home-contact-name">{contact.name}</span>
            <strong>{contact.phone}</strong>
            {contact.role ? <small>{contact.role}</small> : null}
          </a>
        ))}
      </div>
    </section>
  );
}
