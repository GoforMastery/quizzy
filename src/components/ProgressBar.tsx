import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  solved: number;
  total: number;
}

export default function ProgressBar({ solved, total }: ProgressBarProps) {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="progress-upload">
        <span>Quiz Progress</span>
        <span className="ml-auto">{Math.floor((solved / total) * 100)}%</span>
      </FieldLabel>
      <Progress value={Math.floor((solved / total) * 100)} id="progress-upload" />
    </Field>
  );
}
