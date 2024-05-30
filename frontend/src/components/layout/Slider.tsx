import { useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import imageData from "../../store/imageData";
import Styles from "../../styles/layout/Slider.module.css";

const Slider = () => {
    const renderSlides = imageData.map(image => (
        <div key={image.alt} style={{margin: 'auto'}}>
          <img src={image.url} alt={image.alt} className={Styles.carousel} />
        </div>
    ));
    
    const [currentIndex, setCurrentIndex] = useState(0);
    
    function handleChange(index:number) {
      setCurrentIndex(index);
    }

    return (
        <div 
        style={{paddingTop:'20px', marginBottom:'50px', paddingBottom:'20px'}}>
            <Carousel
            swipeable={true}
            showArrows={true}
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={false}
            onChange={handleChange}>
            {renderSlides}
            </Carousel>
        </div>
    )
}

export default Slider;