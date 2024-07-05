import { Button, Card, Flex, Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { ROUTE_NAMES } from "../../routes/routes";

const { Header, Content, Footer } = Layout;

const MAX_SCORE = 5;

const BeginGame = () => {
  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "white" }}>
        <Typography.Title style={{ marginTop: "20px" }} level={4}>
          Welcome
        </Typography.Title>
      </Header>
      <Content style={{ height: "80vh" }}>
        <Flex
          style={{ height: "100%" }}
          justify="center"
          align="center"
          vertical
        >
          <Button
            size="large"
            onClick={() => navigate(ROUTE_NAMES.CLICK_GAME)}
            style={{ marginBottom: "30px" }}
            danger
          >
            Join Game
          </Button>
          <Card title="Instructions">
            <Flex vertical>
              <Typography.Text style={{ marginBottom: "10px" }}>
                {`The first player to click the button successfully ${MAX_SCORE} times first
              wins.`}
              </Typography.Text>
              <Typography.Text style={{ marginBottom: "15px" }}>
                {`最先成功点击按钮${MAX_SCORE}次的玩家获胜。`}
              </Typography.Text>
              <Typography.Text
                style={{ marginBottom: "20px" }}
              >{`Good luck! :)`}</Typography.Text>
              <Typography.Text type="danger" style={{ fontSize: "8px" }}>
                {`** Brace yourselves - There will be a surprise at the end. Losers, beware! :)))`}
              </Typography.Text>
            </Flex>
          </Card>
        </Flex>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default BeginGame;
