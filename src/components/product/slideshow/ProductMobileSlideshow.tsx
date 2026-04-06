'use client';
import Image from 'next/image';

import { Swiper } from 'swiper/react';
import { SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './slideshow.css';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import { ProductImage } from '@/components';

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlideshow = ({ title, images, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
        style={{ width: '100vw', height: '500px' }}
        pagination
        autoplay={{
          delay: 2500,
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="h-[400px] w-full mySwiper2"
      >
        {images.map((image) => (
          <SwiperSlide key={image} className="relative">
            <ProductImage
              //fill
              width={1024}
              height={800}
              src={image} //`/products/${image}`
              alt={title}
              className=" object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
