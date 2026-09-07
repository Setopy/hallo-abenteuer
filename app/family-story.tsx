export default function FamilyStory() {
  return (
    <section className="grazeet-story" aria-labelledby="family-story-title">
      <figure>
        <img
          src="./brand/family.jpg"
          alt="A family enjoying time together outdoors"
          width="1086"
          height="1448"
          loading="lazy"
        />
        <figcaption>Zusammen wachsen · Growing together</figcaption>
      </figure>
      <div>
        <p className="eyebrow">FAMILY AT THE HEART</p>
        <h2 id="family-story-title">
          A little German.
          <br />A world of connection.
        </h2>
        <p>
          grazeetraum is a place for children and grown-ups to discover
          German together: through colourful stories, everyday conversations and
          moments of play.
        </p>
        <p>
          Bring your curiosity. Try a new word. Celebrate the small steps,
          together.
        </p>
        <div className="grazeet-values">
          <span>
            Entdecken <small>Discover</small>
          </span>
          <span>
            Sprechen <small>Speak</small>
          </span>
          <span>
            Wachsen <small>Grow</small>
          </span>
        </div>
      </div>
    <figure className="grazeet-panorama"><img src="./brand/family-day.jpg" alt="Six family members smiling behind colourful science-themed letters" width="1448" height="1086" loading="lazy"/><figcaption>Gemeinsam entdecken · Discovering together</figcaption></figure>
      <div className="grazeet-moments">
        <figure><img src="./brand/discover.jpg" alt="A child exploring outdoors with a phone in hand" width="750" height="1000" loading="lazy"/><figcaption>Neugier · Curiosity</figcaption></figure>
        <figure><img src="./brand/together.jpg" alt="Two children smiling and holding hands" width="750" height="1000" loading="lazy"/><figcaption>Zusammen · Together</figcaption></figure>
        <figure><img src="./brand/play.jpg" alt="Two children holding hands with their arms outstretched" width="750" height="1000" loading="lazy"/><figcaption>Freude · Joy</figcaption></figure>
      </div></section>
  );
}
