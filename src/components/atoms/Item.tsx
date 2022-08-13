type Props = {
  id: number;
  value: string;
  onItemClick: (key: number) => void;
  isSelected: boolean;
};

export default function (props: Props) {
  const { id, value, onItemClick, isSelected } = props;

  const selectionStyle = isSelected ? "px-8" : "px-8 bg-gray-400 text-white";
  return (
    <li className={selectionStyle} key={id} onClick={() => onItemClick(id)}>
      {value}
    </li>
  );
}
