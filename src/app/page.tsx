'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Memory {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  year: string;
}

const minecraftMemories: Memory[] = [
  {
    id: 1,
    title: "Petualangan Pertama",
    description: "Saya masuk server tanpa kenal siapa pun. Saya hanya membangun rumah kecil di tepi laut. Lalu kalian datang dan membuat permainan ini punya arti.",
    imagePath: "/images/1.jpg",
    year: "2023"
  },
  {
    id: 2,
    title: "Season Yang Berarti",
    description: "Season baru dimulai. Saya membangun base bersama teman-teman. Momen itu jadi titik ketika semuanya terasa hidup lagi. Saya bertemu teman lama, dan ada seseorang yang mulai terasa berbeda.",
    imagePath: "/images/2.jpg",
    year: "2023"
  },
  {
    id: 3,
    title: "Pertemuan yang Saya Rindukan",
    description: "Saya bertemu lagi dengan teman lama. Momen sederhana ini terasa hangat dan membuat season ini berbeda.",
    imagePath: "/images/3.jpg",
    year: "2023"
  },
  {
    id: 4,
    title: "Seseorang yang Mulai Berarti",
    description: "Saya bersama seseorang yang kehadirannya membuat dunia ini terasa lebih dekat.",
    imagePath: "/images/4.jpg",
    year: "2023"
  },
  {
    id: 5,
    title: "Base Terbaik di Season Baru",
    description: "Saya membangun base ini bersama teman. Ini jadi tempat paling solid di season berikutnya. Momen ini juga menutup rasa kecewa dari season sebelumnya dan membuat saya mulai menikmati permainan lagi.",
    imagePath: "/images/5.jpg",
    year: "2024"
  },
  {
    id: 6,
    title: "Rumah Ini Tempat Kami Berkumpul",
    description: "Saya berfoto bersama teman di depan rumah. Momen ini menunjukkan tempat yang kami bangun dan kebersamaan yang membuat season ini terasa hidup.",
    imagePath: "/images/6.jpg",
    year: "2024"
  }
];

// Additional photos without text - Extended gallery
const additionalPhotos = [
  "/images/7.jpg",
  "/images/8.jpg",
  "/images/9.jpg",
  "/images/10.jpg",
  "/images/11.jpg",
  "/images/12.jpg",
  "/images/13.jpg",
  "/images/14.jpg",
  "/images/15.jpg",
  "/images/16.jpg",
  "/images/17.jpg",
];

export default function Home() {
  const [currentMemory, setCurrentMemory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize audio
  useEffect(() => {
    const newAudio = new Audio('/music/audio.mp3');
    newAudio.loop = true;
    newAudio.volume = isMuted ? 0 : 0.3;
    setAudio(newAudio);
    
    return () => {
      newAudio.pause();
      newAudio.remove();
    };
  }, []);

  // Handle audio playback based on user interaction
  useEffect(() => {
    if (!audio) return;

    const handlePlay = async () => {
      try {
        if (isPlaying && hasInteracted) {
          await audio.play();
        } else {
          audio.pause();
        }
      } catch (error) {
        console.error('Audio playback error:', error);
        setIsPlaying(false);
      }
    };

    handlePlay();
  }, [isPlaying, hasInteracted, audio]);

  // Handle mute
  useEffect(() => {
    if (audio) {
      audio.volume = isMuted ? 0 : 0.3;
    }
  }, [isMuted, audio]);

  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (!isPlaying) {
        setIsPlaying(true);
      }
    }
  };

  const togglePlay = () => {
    handleFirstInteraction();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    handleFirstInteraction();
    setIsMuted(!isMuted);
  };

  // Handle all user interactions - Desktop only for wheel
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      handleFirstInteraction();
      
      if (event.deltaY > 0 && currentMemory < minecraftMemories.length) {
        setCurrentMemory(prev => prev + 1);
      } else if (event.deltaY < 0 && currentMemory > 0) {
        setCurrentMemory(prev => prev - 1);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      handleFirstInteraction();
      
      if (event.key === 'ArrowDown' && currentMemory < minecraftMemories.length) {
        setCurrentMemory(prev => prev + 1);
      } else if (event.key === 'ArrowUp' && currentMemory > 0) {
        setCurrentMemory(prev => prev - 1);
      } else if (event.key === ' ') {
        event.preventDefault();
        togglePlay();
      } else if (event.key === 'm') {
        toggleMute();
      }
    };

    const container = containerRef.current;
    if (container && !isMobile) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentMemory, isMobile, isPlaying, isMuted]);

  const scrollToNext = () => {
    handleFirstInteraction();
    if (currentMemory < minecraftMemories.length) {
      setCurrentMemory(currentMemory + 1);
    }
  };

  const scrollToPrevious = () => {
    handleFirstInteraction();
    if (currentMemory > 0) {
      setCurrentMemory(currentMemory - 1);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative h-screen overflow-hidden bg-black"
      onClick={handleFirstInteraction}
    >
      {/* Background with parallax effect */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: isMobile ? 0 : backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </motion.div>

      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-30 bg-black/50 backdrop-blur-sm border-b border-green-400/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-400 rounded-lg flex items-center justify-center">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </div>
            <h1 className="text-base sm:text-xl font-bold text-white">Minecraft Memories</h1>
          </motion.div>
          
          <motion.div 
            className="text-xs sm:text-sm text-gray-400 font-mono truncate max-w-[120px] sm:max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {currentMemory < minecraftMemories.length ? minecraftMemories[currentMemory].title : "Photo Gallery"}
          </motion.div>
        </div>
      </motion.header>

      {/* Memory sections */}
      <div className="relative z-10 h-full pt-16 sm:pt-0">
        {minecraftMemories.map((memory, index) => (
          <div
            key={memory.id}
            className={`absolute inset-0 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 transition-opacity duration-800 ${
              currentMemory === index ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="container mx-auto grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center max-w-[1400px] 2xl:max-w-[1600px]">
              {/* Text content */}
              <motion.div
                className="text-white space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 order-2 lg:order-1 px-2 sm:px-0"
                style={{ y: isMobile ? 0 : textY }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ 
                  x: currentMemory === index ? 0 : -100, 
                  opacity: currentMemory === index ? 1 : 0 
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-1 sm:mb-2 md:mb-4">
                  <Music className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-green-400" />
                  <span className="text-green-400 font-mono text-[10px] sm:text-xs md:text-sm">MEMORY #{memory.id}</span>
                </div>
                
                <motion.h1 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight"
                  initial={{ y: 20 }}
                  animate={{ y: currentMemory === index ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {memory.title}
                </motion.h1>
                
                <motion.p 
                  className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-300 leading-relaxed"
                  initial={{ y: 20 }}
                  animate={{ y: currentMemory === index ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {memory.description}
                </motion.p>
                
                <motion.div 
                  className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 pt-1 sm:pt-2 md:pt-3 lg:pt-4"
                  initial={{ y: 20 }}
                  animate={{ y: currentMemory === index ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 font-mono text-[10px] sm:text-xs md:text-sm">{memory.year}</span>
                  </div>
                  <div className="h-3 sm:h-4 md:h-5 lg:h-6 w-px bg-gray-600" />
                  <span className="text-gray-400 text-[10px] sm:text-xs md:text-sm">
                    {index + 1} / {minecraftMemories.length}
                  </span>
                </motion.div>
              </motion.div>

              {/* Image content */}
              <motion.div
                className="relative order-1 lg:order-2"
                initial={{ x: 100, opacity: 0 }}
                animate={{ 
                  x: currentMemory === index ? 0 : 100, 
                  opacity: currentMemory === index ? 1 : 0 
                }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative group">
                  <div className="relative w-full h-[200px] sm:h-[280px] md:h-[350px] lg:h-[420px] xl:h-[500px] 2xl:h-[600px] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-gray-800">
                    <Image
                      src={memory.imagePath}
                      alt={memory.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 45vw, 700px"
                      priority={index <= 1}
                      quality={85}
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none" />
                  <div className="absolute inset-0 border-2 border-green-400/30 rounded-lg sm:rounded-xl md:rounded-2xl group-hover:border-green-400/60 transition-all duration-300 pointer-events-none" />
                  
                  {/* Image overlay info */}
                  <motion.div 
                    className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4 text-white pointer-events-none"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-[8px] sm:text-[10px] md:text-xs text-green-400 font-mono">LIVE</span>
                      </div>
                      <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-400">
                        {memory.year}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        ))}
        
        {/* Additional Photo Gallery - No Text */}
        <div
          className={`absolute inset-0 flex flex-col ${
            currentMemory === minecraftMemories.length ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex-grow overflow-y-auto pt-16 pb-24">
            <div className="container mx-auto max-w-[1400px] 2xl:max-w-[1600px] px-3 sm:px-4 md:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ 
                  opacity: currentMemory === minecraftMemories.length ? 1 : 0,
                  y: currentMemory === minecraftMemories.length ? 0 : 50
                }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 pb-8"
              >
                {additionalPhotos.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: currentMemory === minecraftMemories.length ? 1 : 0,
                      scale: currentMemory === minecraftMemories.length ? 1 : 0.8
                    }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="relative group"
                  >
                    <div className="relative w-full aspect-square rounded-md sm:rounded-lg md:rounded-xl overflow-hidden bg-gray-800">
                      <Image
                        src={photo}
                        alt={`Memory ${index + 7}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        quality={85}
                      />
                    </div>
                    <div className="absolute inset-0 border-2 border-green-400/0 rounded-md sm:rounded-lg md:rounded-xl group-hover:border-green-400/50 transition-all duration-300 pointer-events-none" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-md sm:rounded-lg md:rounded-xl pointer-events-none" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-20 h-0.5 sm:h-1 bg-gray-800"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-green-400 to-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentMemory + 1) / (minecraftMemories.length + 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Navigation controls */}
      <motion.div 
        className="fixed bottom-16 sm:bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3 sm:gap-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={scrollToPrevious}
          disabled={currentMemory === 0}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 sm:p-3 md:p-3.5 lg:p-4 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          size="icon"
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 rotate-180" />
        </Button>
        
        <Button
          onClick={scrollToNext}
          disabled={currentMemory === minecraftMemories.length}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 sm:p-3 md:p-3.5 lg:p-4 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          size="icon"
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6" />
        </Button>
      </motion.div>

      {/* Music controls */}
      <motion.div 
        className="fixed top-16 sm:top-20 md:top-20 right-3 sm:right-6 md:right-8 z-20 flex gap-2 sm:gap-3 md:gap-4"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={togglePlay}
          variant="outline"
          size="icon"
          className="bg-black/50 border-green-400/30 text-green-400 hover:bg-green-400/20 hover:text-green-300 relative overflow-hidden w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
        >
          <motion.div
            className="absolute inset-0 bg-green-400/20"
            initial={{ scale: 0 }}
            animate={{ scale: isPlaying ? 1.5 : 0 }}
            transition={{ duration: 0.3, repeat: isPlaying ? Infinity : 0, repeatType: "reverse" }}
          />
          {isPlaying ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 relative z-10" />
            </motion.div>
          ) : (
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 relative z-10" />
          )}
        </Button>
        
        <Button
          onClick={toggleMute}
          variant="outline"
          size="icon"
          className="bg-black/50 border-green-400/30 text-green-400 hover:bg-green-400/20 hover:text-green-300 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
        >
          {isMuted ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />}
        </Button>
        
        {/* Music visualizer */}
        <AnimatePresence>
          {isPlaying && !isMuted && hasInteracted && (
            <motion.div
              className="hidden sm:flex items-end gap-1 h-6 sm:h-7 md:h-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 sm:w-0.5 md:w-1 bg-green-400 rounded-full"
                  animate={{ height: [6, 12, 6] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress indicator - Hidden on mobile */}
      <motion.div 
        className="hidden lg:block fixed left-4 lg:left-6 xl:left-8 top-1/2 transform -translate-y-1/2 z-20"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex flex-col gap-2 lg:gap-2.5">
          {[...minecraftMemories, { id: 'gallery' }].map((item, index) => (
            <motion.div
              key={item.id}
              className={`w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                currentMemory === index ? 'bg-green-400 scale-150' : 'bg-gray-600'
              }`}
              onClick={() => {
                handleFirstInteraction();
                setCurrentMemory(index);
              }}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator - Hidden on mobile */}
      <motion.div 
        className="hidden lg:block fixed bottom-6 lg:bottom-8 right-6 lg:right-8 z-20 text-green-400/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="text-xs lg:text-sm font-mono">SCROLL</div>
        <div className="w-px h-12 lg:h-16 bg-green-400/30 mx-auto mt-2" />
        <div className="text-[10px] lg:text-xs text-gray-500 mt-2 text-center">
          <div>↑↓ Navigate</div>
          <div>Space Play/Pause</div>
          <div>M Mute</div>
        </div>
      </motion.div>

      {/* First interaction overlay */}
      {!hasInteracted && (
        <motion.div 
          className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center flex-col gap-4 text-white px-4"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-center"
          >
            <Music className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-green-400 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Minecraft Memories</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">Click anywhere to start the experience</p>
            <Button 
              onClick={handleFirstInteraction}
              className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-3"
            >
              Start Journey
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}