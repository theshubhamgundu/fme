import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const events = [
  {
    id: 1,
    title: 'TechnoVation 2024',
    type: 'hackathon',
    date: 'March 15-17, 2024',
    location: 'IIT Delhi',
    participants: '500+',
    image: 'https://images.unsplash.com/photo-1649451844813-3130d6f42f8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTY1NjIzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    gradient: 'from-cyan-500/20 to-green-500/20',
    accent: 'text-cyan-400'
  },
  {
    id: 2,
    title: 'Spring Fest 2024',
    type: 'cultural',
    date: 'April 2-4, 2024',
    location: 'JNU Delhi',
    participants: '2000+',
    image: 'https://images.unsplash.com/photo-1711804224670-82814a88be82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTY1NjIzMzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    gradient: 'from-purple-500/20 to-pink-500/20',
    accent: 'text-purple-400'
  },
  {
    id: 3,
    title: 'Inter-College Championship',
    type: 'sports',
    date: 'March 20-25, 2024',
    location: 'DU Sports Complex',
    participants: '800+',
    image: 'https://images.unsplash.com/photo-1583079806406-91731880e785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTY1NjIzMzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    gradient: 'from-orange-500/20 to-red-500/20',
    accent: 'text-orange-400'
  },
  {
    id: 4,
    title: 'AI & ML Workshop',
    type: 'workshop',
    date: 'March 28, 2024',
    location: 'IIIT Hyderabad',
    participants: '200+',
    image: 'https://images.unsplash.com/photo-1733758283615-224f76ab0792?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTY1NjIzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    gradient: 'from-yellow-500/20 to-teal-500/20',
    accent: 'text-yellow-400'
  }
];

function EventBackgroundAnimation({ type }: { type: string }) {
  switch (type) {
    case 'hackathon':
      return (
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-cyan-400/30 text-xs"
              style={{ 
                left: `${10 + i * 20}%`, 
                top: `${20 + (i % 2) * 40}%` 
              }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity 
              }}
            >
              {'{ }'}
            </motion.div>
          ))}
        </div>
      );
    
    case 'cultural':
      return (
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-4 w-1 bg-gradient-to-t from-purple-500/40 to-transparent rounded-t-full"
              style={{ left: `${20 + i * 25}%`, height: '30px' }}
              animate={{ 
                scaleY: [1, 1.5, 0.8, 1.2, 1],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity 
              }}
            />
          ))}
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-full bg-gradient-to-b from-purple-400/20 to-transparent"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ clipPath: 'polygon(45% 0%, 55% 0%, 70% 100%, 30% 100%)' }}
          />
        </div>
      );
    
    case 'sports':
      return (
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <motion.div
            className="absolute w-3 h-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"
            initial={{ x: 10, y: 30 }}
            animate={{ 
              x: [10, 40, 70, 100],
              y: [30, 10, 30, 5]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-4 right-4 w-2 h-6 bg-gradient-to-t from-orange-500/40 to-transparent rounded-t-full"
            animate={{ 
              y: [0, -5, 0],
              scaleX: [1, 0.7, 1]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity 
            }}
          />
        </div>
      );
    
    case 'workshop':
      return (
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {Array.from({ length: 2 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-4 bg-gradient-to-r from-yellow-400/40 to-teal-400/40 rounded-sm"
              style={{ 
                right: `${20 + i * 30}%`, 
                top: `${30 + i * 20}%` 
              }}
              animate={{ 
                rotate: [0, 10, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                delay: i * 0.5,
                repeat: Infinity 
              }}
            />
          ))}
          <motion.div
            className="absolute top-1/4 left-1/4 w-8 h-6 bg-gradient-to-br from-teal-300/20 to-yellow-300/20 rounded border border-teal-400/30"
            animate={{ 
              boxShadow: [
                "0 0 5px rgba(20, 184, 166, 0.2)",
                "0 0 15px rgba(20, 184, 166, 0.4)",
                "0 0 5px rgba(20, 184, 166, 0.2)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      );
    
    default:
      return null;
  }
}

export function FeaturedEvents() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Featured Events
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't miss out on these amazing upcoming events
          </p>
        </motion.div>
        
        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${event.gradient} border border-border backdrop-blur-sm transition-all duration-300 group-hover:border-border/50 group-hover:shadow-2xl bg-card`}>
                {/* Background Animation */}
                <EventBackgroundAnimation type={event.type} />
                
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Event Type Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm border border-border text-sm ${event.accent} capitalize`}>
                    {event.type}
                  </div>
                </div>
                
                {/* Event Content */}
                <div className="p-6 relative z-10">
                  <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-card-foreground/90 transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      {event.participants} participants
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary/10 hover:bg-primary/20 backdrop-blur-sm border border-border text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button 
            size="lg"
            variant="outline"
            className="border-purple-500/50 text-purple-500 hover:bg-purple-500/10 hover:border-purple-400 px-8"
          >
            View All Events
          </Button>
        </motion.div>
      </div>
    </section>
  );
}