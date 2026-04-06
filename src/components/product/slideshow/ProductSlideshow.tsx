'use client';
import { useState } from 'react';
import Image from 'next/image';

import { Swiper as SwiperObject } from 'swiper';

import { Swiper } from 'swiper/react';
import { SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './slideshow.css';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { ProductImage } from '@/components';

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductSlideshow = ({ title, images, className }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();

  return (
    <div className={className}>
      <Swiper
        style={
          {
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        autoplay={{
          delay: 2500,
        }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="h-[400px] w-full mySwiper2"
      >
        {images.map((image) => (
          <SwiperSlide key={image} className="relative">
            <ProductImage
              width={1024}
              height={800}
              src={image}
              alt={title}
              className="rounded-lg w-full h-full object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={2}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="h-[80px] mt-2 mySwiper"
      >
        {images.map((image) => (
          <SwiperSlide key={image} className="relative h-full">
            <ProductImage
              width={300}
              height={300}
              src={image}
              alt={title}
              className="rounded-lg w-full h-full object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
