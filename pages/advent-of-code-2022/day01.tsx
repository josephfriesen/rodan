import { useEffect, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import Layout, { SITE_TITLE } from "../../components/aocpage";
import utilStyles from "../../styles/utils.module.sass";
import { getAOCInput } from "../../lib/advent-of-code-2022/getAOCInput";

const DAY = 1;

export const getStaticProps: GetStaticProps = async () => {
  const { fileContents, publicPath } = await getAOCInput(1);

  return {
    props: {
      input: fileContents,
      pathToInput: publicPath,
    },
  };
};

interface AOC2022Day1Props {
  input: string;
  pathToInput: string;
}

const AOC2022Day1 = ({ input, pathToInput }: AOC2022Day1Props) => {
  const elvesInventoryLists = useMemo<Array<Array<number>>>(() => {
    if (!input) return null;

    const entries = input.split("\n").map((e) => e.replace("\r", ""));
    let elvenArrays: Array<Array<number>> = [];
    let elf: Array<number> = [];
    while (entries.length > 0) {
      const next = entries.shift();
      if (next.length > 0) {
        const calories = parseInt(next);
        elf = [...elf, calories];
      } else {
        elvenArrays = [...elvenArrays, elf];
        elf = [];
      }
    }
    return elvenArrays;
  }, [input]);

  const elvesCalorieTotals = useMemo<Array<number>>(() => {
    return (
      elvesInventoryLists?.map((elf: Array<number>) => {
        return elf.reduce(
          (totalCalories: number, itemCalories: number) =>
            totalCalories + itemCalories,
          0
        );
      }) || null
    );
  }, [elvesInventoryLists]);

  const elfHighestCalorieCount = useMemo(() => {
    if (!elvesCalorieTotals) return null;

    let highestIndex = -1;
    let highestCount = 0;

    for (const [elfIndex, elfCalorieTotal] of elvesCalorieTotals.entries()) {
      if (elfCalorieTotal > highestCount) {
        highestIndex = elfIndex;
        highestCount = elfCalorieTotal;
      }
    }

    return {
      elfIndex: highestIndex,
      calorieCount: highestCount,
    };
  }, [elvesCalorieTotals]);

  const topThreeCalorieCounts = useMemo(() => {
    if (!elvesCalorieTotals) return null;

    const topThree = elvesCalorieTotals.sort((a, b) => b - a).slice(0, 3);
    const count = topThree.reduce((sum, count) => sum + count, 0);

    return {
      topThree,
      count,
    };
  }, [elvesCalorieTotals]);

  return (
    <Layout>
      <Head>
        <title>{SITE_TITLE} | Day 1</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        {SITE_TITLE} | Day 1
      </section>
      <section>
        <h2 className={utilStyles.headingSm}>Part 1 Solution</h2>
        <ul>
          {input && typeof input === "string" && (
            <li>
              <p>
                Our given input is a string that looks something like this:
                <br />
                <span
                  style={{ display: "block" }}
                  className={utilStyles.ellipsis}
                >
                  {input}
                </span>
                <br />
                <Link href={pathToInput}>See the full input</Link>
              </p>
            </li>
          )}
          {elvesInventoryLists && (
            <li>
              <p>
                Taking that string and grouping lines separated by empty lines,
                we get our elves' inventory with calories that looks something
                like this:
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Elf</th>
                    <th>Inventory</th>
                  </tr>
                </thead>
                <tbody>
                  {elvesInventoryLists
                    .slice(0, 10)
                    .map((elfInventory, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{elfInventory.join(", ")}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <p>...</p>
            </li>
          )}
          {elvesCalorieTotals && (
            <li>
              <p>
                Given the list of lists we have above, with each list
                representing an elf's inventory of items' calorie total, we can
                sum each inventory to give the total calories each elf is
                carrying. This looks something like this:
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Elf</th>
                    <th>Total Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {elvesCalorieTotals.slice(0, 10).map((elfCalories, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{elfCalories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>...</p>
            </li>
          )}
          {elfHighestCalorieCount && (
            <li>
              <p>
                Then, we take the entry in this list with the highest value,
                which gives the elf carrying the items with the highest total
                calorie count.
              </p>
              <p>
                The elf with the highest calorie count is the elf at index{" "}
                {elfHighestCalorieCount.elfIndex}, who is carrying items with a
                total of {elfHighestCalorieCount.calorieCount} calories.
              </p>
            </li>
          )}
        </ul>
        <h2 className={utilStyles.headingSm}>Solution Part 2</h2>
        <ul>
          {topThreeCalorieCounts && (
            <>
              <li>
                If we sort the list of elves by total calorie count, take the
                first three entries in that sorted list, we will have our three
                elves with highest calorie count.
              </li>
              <li>
                The top three calorie counts are{" "}
                {topThreeCalorieCounts.topThree.join(", ")}, and their calorie
                total is {topThreeCalorieCounts.count}
              </li>
            </>
          )}
        </ul>
      </section>
      <footer>
        <Link href="/advent-of-code-2022/day02">Day 2</Link>
      </footer>
    </Layout>
  );
};

export default AOC2022Day1;
