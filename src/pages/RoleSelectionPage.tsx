import { motion } from "framer-motion";
import { User, Stethoscope, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from ".././components/ui/card";
import { Button } from ".././components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8"
      >
        <Link to="/">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Button>
        </Link>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full text-center"
      >
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Choose Your Path</h1>
          <p className="text-muted-foreground text-lg">Select how you want to experience Aura Health.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <RoleCard
            title="As a Patient"
            description="Book appointments, chat with specialists, and manage your health records with AI assistance."
            icon={<User className="h-12 w-12" />}
            role="patient"
            color="bg-purple-600"

          />
          <RoleCard
            title="As a Doctor"
            description="Manage your practice, connect with patients, and utilize AI tools for enhanced diagnostics."
            icon={<Stethoscope className="h-12 w-12" />}
            role="doctor"
            color="bg-[#13B7A2]"

          />
        </div>
      </motion.div>
    </div>
  );
}

function RoleCard({ title, description, icon, role, color }: { title: string, description: string, icon: React.ReactNode, role: string, color: string }) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="relative overflow-hidden group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
        <CardContent className="p-10 flex flex-col items-center text-center">
          <div className={`w-24 h-24 rounded-3xl ${color} text-white flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <h2 className="text-2xl font-bold font-display mb-4">{title}</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {description}
          </p>
          <Button className={`w-full h-14 rounded-full ${color} hover:opacity-90 text-white gap-2 font-bold`}>
            Continue as {role === 'patient' ? 'Patient' : 'Doctor'}
            <ChevronRight className="h-5 w-5" />
          </Button>
        </CardContent>

        {/* Decorative background element */}
        <div className={`absolute -bottom-12 -right-12 w-32 h-32 ${color} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
      </Card>
    </motion.div>
  );
}