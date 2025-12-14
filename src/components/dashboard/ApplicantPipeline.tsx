import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PipelineStage {
  name: string;
  count: number;
  color: string;
}

interface ApplicantPipelineProps {
  stages: PipelineStage[];
}

export const ApplicantPipeline = ({ stages }: ApplicantPipelineProps) => {
  const totalApplicants = stages.reduce((acc, stage) => acc + stage.count, 0);

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Hiring Pipeline</h3>
          <p className="text-sm text-muted-foreground">{totalApplicants} total candidates</p>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="flex items-center gap-2 mb-8">
        {stages.map((stage, index) => (
          <div key={stage.name} className="flex items-center flex-1">
            <div
              className={cn(
                "flex-1 rounded-lg p-4 text-center cursor-pointer transition-all duration-200 hover:scale-105",
                stage.color
              )}
            >
              <p className="text-2xl font-bold text-foreground mb-1">{stage.count}</p>
              <p className="text-xs text-muted-foreground">{stage.name}</p>
            </div>
            {index < stages.length - 1 && (
              <ChevronRight className="w-5 h-5 text-muted-foreground mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-secondary rounded-full overflow-hidden flex">
        {stages.map((stage, index) => {
          const percentage = (stage.count / totalApplicants) * 100;
          return (
            <div
              key={stage.name}
              className={cn("h-full transition-all duration-300", stage.color.replace('/10', ''))}
              style={{ width: `${percentage}%` }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        {stages.map((stage) => (
          <div key={stage.name} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", stage.color.replace('/10', ''))} />
            <span className="text-sm text-muted-foreground">{stage.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
