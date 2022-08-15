type Props = {
  text: string;
};
export default function Heading1(props: Props) {
  const { text } = props;
  return <h1>{text}</h1>;
}
