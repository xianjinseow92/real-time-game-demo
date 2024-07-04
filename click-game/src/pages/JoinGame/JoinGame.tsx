import { Button, Card, Flex, Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { ROUTE_NAMES } from "../../routes/routes";

const { Header, Content, Footer } = Layout;

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
                {`The first player to click the button successfully 3 times first
              wins.`}
              </Typography.Text>
              <Typography.Text style={{ marginBottom: "10px" }}>
                {`最先成功点击按钮3次的玩家获胜。`}
              </Typography.Text>
              <Typography.Text>{`Good luck! :)`}</Typography.Text>
            </Flex>
          </Card>
        </Flex>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default BeginGame;
