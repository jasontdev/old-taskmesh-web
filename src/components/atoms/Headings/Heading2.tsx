type Props = {
  text: string;
};
export default function Heading2(props: Props) {
  const { text } = props;
  return <h2 className="text-2xl font-bold px-8 pb-4">{text}</h2>;
}
