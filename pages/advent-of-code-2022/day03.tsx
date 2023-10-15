import { useEffect, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import Layout, { SITE_TITLE } from "../../components/aoc_page_layout";
import styles from "../../components/aoc.module.scss";
import utilStyles from "../../styles/utils.module.sass";
import _ from "lodash";
import { getAOCInput } from "../../lib/advent-of-code-2022/getAOCInput";

export const getStaticProps: GetStaticProps = async () => {
  const { fileContents, publicPath } = await getAOCInput(3);

  return {
    props: {
      input: fileContents,
      pathToInput: publicPath,
    },
  };
};

interface AOC2022Day3Props {
  input: string;
  pathToInput: string;
}

const getCommonCharacter = ([str1, str2]: [string, string]): string => {
  try {
    const len = str1.length;
    if (len !== str2.length) {
      console.log(str1);
      console.log(str2);
      throw new Error("strings are not equal length");
    }

    let common: string | null = null;
    const map = new Map<string, boolean>();
    const unique1 = _.uniq(str1.split(""))
      .sort()
      .forEach((char) => {
        map.set(char, true);
      });
    const unique2 = _.uniq(str2.split(""))
      .sort()
      .forEach((char) => {
        if (map.get(char) === true) {
          if (common !== null) {
            throw new Error("multiple common characters found");
          } else {
            common = char;
          }
        }
      });

    if (common === null) {
      console.log(str1);
      console.log(str2);
      console.log(map);
      throw new Error("no common characters found");
    }

    return common;
  } catch (e) {
    console.error(e);
    return "";
  }
};

const commonCharactersMap = (
  str1: string,
  str2: string
): Map<string, boolean> => {
  const map = new Map();
  const str1split = str1.split("");
  for (const s of str1split) {
    if (str2.includes(s)) {
      map.set(s, true);
    }
  }
  return map;
};

const getCommonCharacterFromGroup = (group: Array<string>): string => {
  const [rucksack1, rucksack2, rucksack3] = group;
  const commonCharactersFirstPair = commonCharactersMap(rucksack1, rucksack2);
  const testSackArray = rucksack3.split("");
  let common: string;
  for (const c of testSackArray) {
    if (commonCharactersFirstPair.get(c) === true) {
      common = c;
      break;
    }
  }
  return common;
};

const buildCharacterValueMap = (): Map<string, number> => {
  const map = new Map<string, number>();
  const capsStart = 64;
  const lowerStart = 96;
  for (let i = 1; i <= 26; i++) {
    let lowerValue = i;
    let capsValue = 26 + i;
    let lowerCode = lowerStart + i;
    let capsCode = capsStart + i;
    map.set(String.fromCharCode(lowerCode), lowerValue);
    map.set(String.fromCharCode(capsCode), capsValue);
  }

  return map;
};

const CHARACTER_MAP = buildCharacterValueMap();

const AOC2022Day3 = ({ input, pathToInput }: AOC2022Day3Props) => {
  const compartments = useMemo<Array<Array<string>> | null>(() => {
    if (!input) return null;

    const strings = input.split("\n").map((s) => s.trim());
    return strings.map((rucksack) => {
      const half = rucksack.length / 2;
      const compartment1 = rucksack.slice(0, half);
      const compartment2 = rucksack.slice(half, rucksack.length);

      return [compartment1, compartment2];
    });
  }, [input]);

  const rucksackValues = useMemo<Array<number> | null>(() => {
    if (!compartments) return null;

    return compartments.map((rucksack) => {
      const [compartment1, compartment2] = rucksack as [string, string];
      const common = getCommonCharacter([compartment1, compartment2]);
      return CHARACTER_MAP.get(common);
    });
  }, [compartments]);

  const rucksackTotal = useMemo<number | null>(() => {
    if (!rucksackValues) return null;

    return rucksackValues.reduce((sum, current) => sum + current, 0);
  }, [rucksackValues]);

  const groups = useMemo<Array<Array<string>>>(() => {
    const chunks = _.chunk(
      input.split("\n").map((s) => _.uniq(s.trim()).sort().join("")),
      3
    );
    return chunks;
  }, [input]);

  const groupCommonCharacters = useMemo<Array<string>>(() => {
    return groups.map((group) => {
      return getCommonCharacterFromGroup(group);
    });
  }, [groups]);

  const groupPrioritiesSum = useMemo<number>(() => {
    return groupCommonCharacters.reduce(
      (sum, current) => sum + CHARACTER_MAP.get(current),
      0
    );
  }, [groups]);

  return (
    <Layout>
      <Head>
        <title>{SITE_TITLE} | Day 3</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        {SITE_TITLE} | Day 3
      </section>
      <section>
        <h2 className={utilStyles.headingSm}>Part 1 Solution</h2>
        <ul>
          <li>
            <p>
              Given <Link href={pathToInput}>input</Link>, first parse input
              string into an array of strings separated by new line. Each string
              represents a single elf's rucksack with two compartments.
            </p>
            <p>
              Then, convert each individual rucksack into into two-element
              arrays, the values being strings corresponding to the rucksack's
              two compartments.
            </p>
          </li>
          <li>
            <p>
              Next, for each pair of compartments, we need to find the single
              character common to both. To do this, we first create a{" "}
              <span className={styles.code}>compartmentMap</span> of key-value
              pairs, where the key is an individual character in the first
              compartment and the value is True. We split the first compartment
              into an array of individual characters and set the key-value
              pairs. (We could slightly optimize this by first filtering
              duplicate characters).
            </p>
            <p>
              Then, split the second compartment into individual characters,
              iterate through this array, then for any character{" "}
              <span className={styles.code}>c</span> in the array, if{" "}
              <span className={styles.code}>compartmentMap[c] == true</span>, we
              know <span className={styles.code}>c</span> is common to both
              compartments.
            </p>
          </li>
          <li>
            <p>
              Finally, we need to be able to convert a common character to an
              integer value, called a priority, so we can sum the priorities of
              all the rucksacks. To do this, in javascript, we use the built-in
              <span className={styles.code}>String.fromCharCode</span> method.
              In unicode, capital letters have a unicode integer value between
              65 and 90, and lowercase letters have a unicode integer value
              between 97 and 122.
            </p>
            <p>
              To build a <span className={styles.code}>characterMap</span> of
              key-value pairs, with key being a character and value its
              priority, we loop through{" "}
              <span className={styles.code}>i = 1, 2, ... , 26</span>. To
              capture the <span className={styles.code}>i</span>th lower case
              letter and its priority, we set
            </p>
            <div className={styles.codeblock}>
              <div>char := String.fromCharCode(96 + i)</div>
              <div>priority := i</div>
            </div>
            <p>
              and capture the <span className={styles.code}>i</span>th upper
              case letter by
            </p>
            <div className={styles.codeblock}>
              <div>char = String.fromCharCode(64 + i)</div>
              <div>priority = 26 + i</div>
            </div>
            <p>
              For each, set{" "}
              <span className={styles.code}>characterMap[char] = priority</span>
              .
            </p>
          </li>
          <li>
            <p>
              Finally, we retrieve the priority for the common character for
              each rucksack, and sum these values. For our input, the sum of the
              priorities is {rucksackTotal}.
            </p>
          </li>
        </ul>
      </section>
      <section>
        <h2 className={utilStyles.headingSm}>Part 2 Solution</h2>
        <ul>
          <li>
            <p>
              First, we partition the input into groups of three. First convert
              the input string into an array split by newline, and from this
              array of strings return an array of 3-element arrays. Each of
              these 3-element arrays represents a group of three elves.
            </p>
          </li>
          <li>
            <p>
              To find the single character common to all three rucksacks in a
              group, we first find all common characters in the first two
              rucksacks. Let <span className="code">common_map</span> be a map
              of key-value pairs with keys individual characters common to the
              first two rucksacks, and value true. First, we divide the string
              from the first rucksack into an array of individual characters. We
              iterate through this array, and for each character{" "}
              <span className="code">c</span>, if the second rucksack string
              contains <span className="code">c</span>
              as a substring, then we set{" "}
              <span className="code">common_map.set(c, true)</span>.
            </p>
            <p>
              Now that we have a map of character common to the first two
              rucksacks, we iterate through the individual characters of the
              third, and for each character <span className="code">c</span> in
              the third rucksack, if{" "}
              <span className="code">common_map.get(c) === true</span>, we know
              that <span className="code">c</span> is common to all three
              rucksacks.
            </p>
          </li>
          <li>
            <p>
              Finally, sum the associated priorities for each common character
              in each group as above. For our input, the sum of the priorities
              is {groupPrioritiesSum}.
            </p>
          </li>
        </ul>
      </section>
    </Layout>
  );
};

export default AOC2022Day3;
