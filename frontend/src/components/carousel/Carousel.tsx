export default function Carousel() {
  return (
    <div
      id="carouselExampleIndicators"
      className="relative h-full carousel slide"
      data-bs-ride="carousel"
    >
      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-0 mb-4 carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div className="relative w-full h-full overflow-hidden carousel-inner">
        <div className="float-left w-full carousel-item active">
          <img
            src="/images/theme1.png"
            className="block object-cover rounded-3xl"
            alt="Wild Landscape"
          />
        </div>
        <div className="float-left w-full carousel-item">
          <img
            src="/images/theme2.png"
            className="block object-scale-down rounded-3xl"
            alt="Camera"
          />
        </div>
        <div className="float-left w-full carousel-item">
          <img
            src="/images/theme3.png"
            className="block object-cover rounded-3xl"
            alt="Exotic Fruits"
          />
        </div>
      </div>
      <button
        className="absolute top-0 bottom-0 left-[-40px] flex items-center justify-center p-0 text-center border-0 carousel-control-prev hover:outline-none hover:no-underline focus:outline-none focus:no-underline"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span
          className="inline-block bg-no-repeat carousel-control-prev-icon"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="absolute top-0 bottom-0 right-[-40px] flex items-center justify-center p-0 text-center border-0 carousel-control-next hover:outline-none hover:no-underline focus:outline-none focus:no-underline"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span
          className="inline-block bg-no-repeat carousel-control-next-icon"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}
