import FormattedSolution from "@components/formatted_solution";

const AOCPage = async (props) => {
  console.log("AOCPage");

  // const router = useRouter();
  // console.log(router);
  // console.log(props);
  const params = await props.params;
  const { year, day } = params;
  console.log(year);
  console.log(day);
  // console.log(params);

  const markdown = `
  markdown
  `

  return (
    <div>
      <FormattedSolution markdown={markdown} />
    </div>
  );
};

export default AOCPage;
