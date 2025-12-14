import { MoreVertical, Mail, Shield, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'recruiter' | 'viewer';
  avatar?: string;
  initials: string;
  lastActive: string;
  jobsManaged: number;
}

interface TeamMembersListProps {
  members: TeamMember[];
}

const roleStyles = {
  admin: 'bg-primary/10 text-primary border-primary/20',
  manager: 'bg-accent/10 text-accent border-accent/20',
  recruiter: 'bg-success/10 text-success border-success/20',
  viewer: 'bg-muted text-muted-foreground border-border',
};

export const TeamMembersList = ({ members }: TeamMembersListProps) => {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Team Members</h3>
            <p className="text-sm text-muted-foreground">{members.length} members in your organization</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground">
            Invite Member
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">{member.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Badge variant="outline" className={cn("capitalize", roleStyles[member.role])}>
                {member.role}
              </Badge>
              <div className="text-right hidden md:block">
                <p className="text-sm text-foreground">{member.jobsManaged} jobs</p>
                <p className="text-xs text-muted-foreground">Last active: {member.lastActive}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem className="focus:bg-secondary">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-secondary">
                    <Shield className="w-4 h-4 mr-2" />
                    Change Role
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:bg-destructive/10">
                    <UserMinus className="w-4 h-4 mr-2" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
