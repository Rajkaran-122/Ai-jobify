import { Calendar, Video, Clock, MapPin, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Interview {
  id: string;
  candidateName: string;
  candidateInitials: string;
  candidateAvatar?: string;
  position: string;
  date: string;
  time: string;
  type: 'video' | 'in-person' | 'phone';
  status: 'upcoming' | 'today' | 'completed';
}

interface UpcomingInterviewsProps {
  interviews: Interview[];
}

export const UpcomingInterviews = ({ interviews }: UpcomingInterviewsProps) => {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Upcoming Interviews</h3>
          <p className="text-sm text-muted-foreground">{interviews.length} scheduled</p>
        </div>
        <Button variant="ghost" className="text-primary hover:text-primary/80">
          <Calendar className="w-4 h-4 mr-2" />
          View Calendar
        </Button>
      </div>

      <div className="space-y-3">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className={cn(
              "p-4 rounded-xl transition-all duration-200",
              interview.status === 'today'
                ? "bg-primary/10 border border-primary/20"
                : "bg-secondary/30 hover:bg-secondary/50"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={interview.candidateAvatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {interview.candidateInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{interview.candidateName}</p>
                  <p className="text-sm text-muted-foreground">{interview.position}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {interview.status === 'today' && (
                  <Button size="sm" className="bg-gradient-primary hover:opacity-90 text-primary-foreground">
                    <Video className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border">
                    <DropdownMenuItem className="focus:bg-secondary">Reschedule</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-secondary">Send Reminder</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10">Cancel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {interview.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {interview.time}
              </span>
              <span className="flex items-center gap-1">
                {interview.type === 'video' ? (
                  <Video className="w-3.5 h-3.5" />
                ) : (
                  <MapPin className="w-3.5 h-3.5" />
                )}
                {interview.type === 'video' ? 'Video Call' : interview.type === 'in-person' ? 'In-Person' : 'Phone'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
