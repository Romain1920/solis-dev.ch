import studioDisplayImage from "../../assets/studio-display-light.webp";

function PortfolioLoop({ activeIndex, loadedCount, slides }) {
  return (
    <div className="editorial-home__portfolio-loop" aria-hidden="true">
      {slides.slice(0, loadedCount).map((project, index) => (
        <figure
          className={`editorial-home__project-slide${
            index === activeIndex ? " is-active" : ""
          }`}
          key={project.id}
        >
          <img
            src={project.src}
            alt=""
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
            decoding="async"
          />
          <figcaption>
            <span>{project.title}</span>
            <small>{project.category}</small>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function StudioDisplay({
  activeIndex,
  decorative = false,
  formContent,
  formInteractive,
  formLayerRef,
  loadedCount,
  portfolioLayerRef,
  slides,
  veilRef,
}) {
  return (
    <div
      className={`editorial-home__display${
        decorative ? " editorial-home__display--preview" : ""
      }`}
      data-editorial-display
    >
      <div className="editorial-home__display-stage">
        <div className="editorial-home__display-screen">
          <div
            className="editorial-home__portfolio-layer"
            ref={portfolioLayerRef}
            aria-hidden="true"
          >
            <PortfolioLoop
              activeIndex={activeIndex}
              loadedCount={loadedCount}
              slides={slides}
            />
          </div>

          {decorative ? null : (
            <div
              className="editorial-home__form-layer"
              ref={formLayerRef}
              aria-hidden={formInteractive ? undefined : "true"}
              inert={!formInteractive}
            >
              {formContent}
            </div>
          )}

          <span
            className="editorial-home__screen-veil"
            ref={veilRef}
            aria-hidden="true"
          />
        </div>

        <img
          className="editorial-home__display-frame"
          src={studioDisplayImage}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </div>
  );
}

export default StudioDisplay;
