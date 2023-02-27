const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("ETHDaddy", () => {
  let ethDaddy
  let deployer, owner1

  const NAME = "ETH Daddy"
  const SYMBOL = "ETHD"

  beforeEach(async () => {
    // Setup accounts
    [deployer, owner1] = await ethers.getSigners()

    // Deploy contract
    const ETHDaddy = await ethers.getContractFactory("ETHDaddy")
    ethDaddy = await ETHDaddy.deploy(NAME, SYMBOL)

    // List a domain
    const transaction = await ethDaddy.connect(deployer).list("jack.eth", tokens(10))
    await transaction.wait()
  })

  describe("Deployment", () => {

    it("Sets the name", async () => {
      const result = await ethDaddy.name()
      expect(result).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
      const result = await ethDaddy.symbol()
      expect(result).to.equal(SYMBOL)
    })

    it("Sets the owner", async () => {
      const result = await ethDaddy.owner()
      expect(result).to.equal(deployer.address)
    })

    it("Returns the max supply", async () => {
      const result = await ethDaddy.maxSupply()
      expect(result).to.equal(1)
    })

})

describe("Domain", () => {
  it('Returns domain attributes', async () => {
    let domain = await ethDaddy.getDomain(1);
    expect(domain.name).to.be.equal("jack.eth")
    expect(domain.cost).to.be.equal(tokens(10))
    expect(domain.isOwned).to.be.equal(false)
  })
})

describe("Minting",() => {
  const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')

  beforeEach(async () => {
    const transaction = await ethDaddy.connect(owner1).mint(ID)
    await transaction.wait()
  })

  it('Updates the owner', async () => {
    const owner = await ethDaddy.ownerOf(ID)
    expect(owner).to.be.equal(owner1.address)
  })
})

})
