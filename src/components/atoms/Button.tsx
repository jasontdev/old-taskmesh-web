type Props = {
  text: string;
  onClick: () => void;
};

export function Button(props: Props) {
  const { text, onClick } = props;
  return (
    <button onClick={onClick} className="font-bold hover:text-sky-500">
      {text}
    </button>
  );
}
