import he from 'he';
type Option = {
  id: string;
  // each option has id.
  text: string;
  isCorrect: boolean;
};
type CardPropTyes = {
  question: string;
  options: Option[];
  selectedOptionId: string;
  // this is selected by user
};
export default function Card(props: CardPropTyes) {
  return (
    <ul className="p-4 mb-4 rounded-lg bg-white border border-slate-200 space-y-2">
      <div className="text-slate-700 font-medium mb-3">{props.question}</div>
      {props.options.map((option) => (
        <li
          key={option.id}
          className={`p-3 rounded-lg border ${
            option.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : option.id === props.selectedOptionId
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex justify-between">
            <div>{he.decode(option.text)}</div>
            <div>
              {option.isCorrect && '✓ '}
              {option.id === props.selectedOptionId && !option.isCorrect && '✗ '}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
