"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/Data/messages.json";

export default function Home() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center  px-10 md:px-24 py-12 ">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold ">
            Dive into the World of Anonymous Conversati ons
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore Silent Sandesh Message - Where your identity remains a
            secrect
          </p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 2100 })]}
          className="w-full max-w-xs mx-6 md:mx-0 px"
        >
          <CarouselContent className="">
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardHeader>{message.title}</CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-lg font-semibold">
                      {message.content}
                    </span>
                  </CardContent>
                </Card> 
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-center p-4">
        @2023 Silent Sandesh Message. All rights reserved.
      </footer>
    </>
  );
}
