import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fortress-fund.com' },
    update: {},
    create: {
      email: 'admin@fortress-fund.com',
      password: adminPassword,
      firstName: 'Fortress',
      lastName: 'Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      wallet: {
        create: {
          balance: 0,
          currency: 'USD',
        },
      },
      profile: {
        create: {
          kycStatus: 'VERIFIED',
        },
      },
    },
  })

  console.log(`✅ Admin created: ${admin.email}`)

  // Create demo user
  const userPassword = await bcrypt.hash('Demo@123456', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@fortress-fund.com' },
    update: {},
    create: {
      email: 'demo@fortress-fund.com',
      password: userPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: true,
      wallet: {
        create: {
          balance: 25000,
          currency: 'USD',
        },
      },
      profile: {
        create: {
          country: 'United States',
          kycStatus: 'VERIFIED',
        },
      },
    },
  })

  console.log(`✅ Demo user created: ${user.email}`)

  // Seed transactions for demo user
  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } })
  if (wallet) {
    await prisma.transaction.createMany({
      data: [
        {
          userId: user.id,
          walletId: wallet.id,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          amount: 10000,
          description: 'Initial deposit',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          walletId: wallet.id,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          amount: 15000,
          description: 'Wire transfer',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          walletId: wallet.id,
          type: 'INVESTMENT',
          status: 'COMPLETED',
          amount: 5000,
          description: 'Growth Portfolio allocation',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          walletId: wallet.id,
          type: 'RETURN',
          status: 'COMPLETED',
          amount: 312.50,
          description: 'Monthly return — Growth Portfolio',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ],
    })

    await prisma.investment.createMany({
      data: [
        {
          userId: user.id,
          name: 'Growth Portfolio',
          description: 'Diversified equity and fixed income',
          principalAmount: 5000,
          currentValue: 5312.50,
          returnRate: 7.5,
          status: 'ACTIVE',
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          maturityDate: new Date(Date.now() + 355 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          name: 'Fixed Income Bond',
          description: '12-month government bond',
          principalAmount: 10000,
          currentValue: 10250,
          returnRate: 4.5,
          status: 'ACTIVE',
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          maturityDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000),
        },
      ],
    })
  }

  console.log('✅ Seed complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
