import { Flex, Layout, Typography, type StatisticProps } from "antd";
import { Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { EVENTS } from "../../constants/constants";
import GameBoard from "./components/GameBoard";
import { useSocket } from "../../hooks/useSocket";

const { Header, Content, Footer } = Layout;

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp start={0} end={value as number} separator=",'" duration={1.5} />
);

const ClickGame = () => {
  const { socket } = useSocket();
  // Set up connection
  // Player 1
  const [score1, setScore1] = useState(0);
  const [player1, setPlayer1] = useState("");

  // Player 2
  const [score2, setScore2] = useState(0);
  const [player2, setPlayer2] = useState("");

  // Spectators
  const [spectators, setSpectators] = useState<string[]>([]);

  /**
   * Game States
   */

  // My Role
  const [myRole, setMyRole] = useState("");

  useEffect(() => {
    // Role setting Players
    socket?.connect();

    socket?.on(EVENTS.ASSIGN_PLAYER, (role) => {
      console.log("Player assigned role: ", role);
      setMyRole(role);
    });

    // Player board
    socket?.on(
      EVENTS.PLAYERS_UPDATED,
      ({ player1, player2, allSpectators }) => {
        setPlayer1(player1);
        setPlayer2(player2);

        if (Array.isArray(allSpectators)) setSpectators([...allSpectators]);
      }
    );

    socket?.on(EVENTS.UPDATE_SCORE, ({ player1, player2 }) => {
      setScore1(player1);
      setScore2(player2);
    });

    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <Flex style={{ width: "50%" }} justify="space-between">
          {player1 && (
            <Statistic title={player1} value={score1} formatter={formatter} />
          )}
          {player2 && (
            <Statistic title={player2} value={score2} formatter={formatter} />
          )}
        </Flex>
      </Header>
      <Content style={{ height: "80vh" }}>
        <Flex style={{ height: "100%" }} justify="center" align="center">
          <GameBoard role={myRole} />
        </Flex>
      </Content>
      <Footer
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Flex justify="space-between" style={{ width: "80%" }}>
          <Flex vertical>
            <Typography.Title
              level={3}
              style={{ margin: 0 }}
            >{`You are`}</Typography.Title>
            <Typography.Title level={5}>{myRole}</Typography.Title>
          </Flex>
          {spectators && spectators?.length > 0 && (
            <>
              <Statistic
                title="Peeps creeping on game"
                value={spectators?.length}
                formatter={formatter}
              />
            </>
          )}
        </Flex>
      </Footer>
    </Layout>
  );
};

export default ClickGame;
