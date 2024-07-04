import { Button, Card, message, Modal, Result, Typography } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import { useSocket } from "../../../hooks/useSocket";
import { EVENTS } from "../../../constants/constants";
import { MehOutlined, QqOutlined, SmileOutlined } from "@ant-design/icons";

const GameBoard = ({ role }: { role: string }) => {
  const { socket } = useSocket();
  const [buttonStyle, setButtonStyle] = useState<CSSProperties>({});
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [gameOver, setGameOver] = useState<{
    resultMessage: React.ReactNode;
    winner: string;
    loser: string;
    icon: React.ReactNode;
  }>({
    resultMessage: <span></span>,
    winner: "",
    loser: "",
    icon: <span></span>,
  });

  const handleButtonClick = () => {
    if (socket) {
      setIsVisible(false); // IMMEDIATELY make button disappear
      socket.emit(EVENTS.CLICKED);
    }
  };

  useEffect(() => {
    if (socket) {
      // Show button
      socket?.on(EVENTS.SHOW_BUTTON, (positionAndSize) => {
        setButtonStyle(positionAndSize);
        setIsVisible(true);
      });

      // Hide button
      socket?.on(EVENTS.CLICKED, (player) => {
        setIsVisible(false);
        message.warning(`${player} got the button!`);
      });

      // Game Over
      socket?.on(EVENTS.GAME_OVER, ({ winner, loser }) => {
        let resultMessage: React.ReactNode;
        let icon: React.ReactNode;
        console.log("XJ game over role: ", role);

        if (role === winner) {
          resultMessage = (
            <>
              Congratulations! <br />
              You've won!!
            </>
          );
          icon = <SmileOutlined />;
        } else {
          resultMessage = (
            <>
              Congratulations!! <br />
              You'll be presenting for the next Tech Sharing session!
            </>
          );
          icon = <MehOutlined />;
        }

        if (role === "Spectator") {
          resultMessage = (
            <>
              {`${winner} won the game!`} <br />
              {`${loser} will be presenting next Tech Sharing Session`}
            </>
          );
          icon = <QqOutlined />;
        }
        setGameOver({ resultMessage, icon, winner, loser });
      });

      socket?.on(EVENTS.GAME_NOT_STARTED, () => {
        message.warning("Please wait for another player!");
      });
    }
  }, [socket, role]);

  return (
    <Card style={{ height: "800px", width: "800px", position: "relative" }}>
      {gameOver?.resultMessage && gameOver?.winner && gameOver?.loser && (
        <Modal visible footer={null} closable={false} centered>
          <Result
            icon={gameOver?.icon ?? null}
            title={<Typography.Title level={1}>Game Over!</Typography.Title>}
            subTitle={
              <Typography.Text style={{ fontSize: "20px" }}>
                {gameOver?.resultMessage}
              </Typography.Text>
            }
          />
        </Modal>
      )}
      {isVisible && !gameOver?.winner && !gameOver?.loser && (
        <Button
          style={buttonStyle}
          onClick={handleButtonClick}
          type="primary"
          danger
          disabled={role === "Spectator"}
        >
          CLICK MEEEE
        </Button>
      )}
    </Card>
  );
};

export default GameBoard;
