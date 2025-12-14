import { MoreVertical, Eye, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  applicants: number;
  views: number;
  status: 'active' | 'paused' | 'closed' | 'draft';
  postedAt: string;
  expiresAt: string;
}

interface JobPostingsTableProps {
  jobs: Job[];
}

const statusStyles = {
  active: 'bg-success/10 text-success border-success/20',
  paused: 'bg-warning/10 text-warning border-warning/20',
  closed: 'bg-muted text-muted-foreground border-border',
  draft: 'bg-secondary text-muted-foreground border-border',
};

export const JobPostingsTable = ({ jobs }: JobPostingsTableProps) => {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Job Title</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Applicants</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Views</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Posted</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Expires</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-foreground">{job.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.department} • {job.location} • {job.type}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <Badge variant="outline" className={cn("capitalize", statusStyles[job.status])}>
                    {job.status}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{job.applicants}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{job.views}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-muted-foreground">{job.postedAt}</td>
                <td className="py-4 px-6 text-muted-foreground">{job.expiresAt}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem className="focus:bg-secondary">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-secondary">
                          <Eye className="w-4 h-4 mr-2" />
                          View Applicants
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
