import type { ProblemSummary } from '../../types';

interface ProblemSelectorProps {
  problems: ProblemSummary[];
  selectedProblemId: number;
  onSelect: (id: number) => void;
  id?: string;
  className?: string;
}

const ProblemSelector = ({
  problems,
  selectedProblemId,
  onSelect,
  id,
  className = '',
}: ProblemSelectorProps) => (
  <select
    id={id}
    value={selectedProblemId}
    onChange={(event) => {
      const nextId = Number(event.target.value);
      onSelect(nextId);
    }}
    className={className}
  >
    {problems.map((problem) => (
      <option key={problem.id} value={problem.id}>
        {problem.id}. {problem.title}
      </option>
    ))}
  </select>
);

export default ProblemSelector;
