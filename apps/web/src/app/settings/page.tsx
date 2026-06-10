'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { User, Lock, Shield, CheckCircle2 } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: string
  status: string
  emailVerified: boolean
  createdAt: string
  profile: {
    address: string | null
    city: string | null
    country: string | null
    postalCode: string | null
    occupation: string | null
    kycStatus: string
  } | null
}

function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div
      className={`rounded-lg px-4 py-3 text-sm flex items-center gap-2 ${
        type === 'success'
          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
          : 'bg-red-500/10 border border-red-500/20 text-red-400'
      }`}
    >
      {type === 'success' && <CheckCircle2 size={16} />}
      {message}
    </div>
  )
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    occupation: '',
  })

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/user/profile')
      const data = await res.json()
      if (data.success) {
        const u = data.data.user
        setUser(u)
        setProfile({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          phone: u.phone || '',
          address: u.profile?.address || '',
          city: u.profile?.city || '',
          country: u.profile?.country || '',
          postalCode: u.profile?.postalCode || '',
          occupation: u.profile?.occupation || '',
        })
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUser() }, [fetchUser])

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMsg(null)
    setProfileErrors({})

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()

      if (data.success) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully.' })
        fetchUser()
      } else if (data.errors) {
        const errs: Record<string, string> = {}
        for (const [k, v] of Object.entries(data.errors)) {
          errs[k] = (v as string[])[0]
        }
        setProfileErrors(errs)
      } else {
        setProfileMsg({ type: 'error', text: data.error || 'Failed to update profile.' })
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Something went wrong.' })
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setSavingPassword(true)
    setPasswordMsg(null)
    setPasswordErrors({})

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change-password', ...passwords }),
      })
      const data = await res.json()

      if (data.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully.' })
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else if (data.errors) {
        const errs: Record<string, string> = {}
        for (const [k, v] of Object.entries(data.errors)) {
          errs[k] = (v as string[])[0]
        }
        setPasswordErrors(errs)
      } else {
        setPasswordMsg({ type: 'error', text: data.error || 'Failed to change password.' })
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'Something went wrong.' })
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-3xl">
        <div className="h-8 bg-fortress-steel rounded w-40" />
        <div className="h-64 bg-fortress-navy rounded-xl" />
        <div className="h-48 bg-fortress-navy rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-3xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Account settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your profile and security preferences.</p>
      </div>

      {/* Account overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-fortress-accent" />
            <CardTitle>Account overview</CardTitle>
          </div>
          <CardDescription>Your account status and verification details.</CardDescription>
        </CardHeader>
        <div className="grid sm:grid-cols-3 gap-4 mt-2">
          <div className="bg-fortress-steel/40 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Account status</p>
            <Badge variant={user?.status === 'ACTIVE' ? 'success' : 'warning'}>
              {user?.status}
            </Badge>
          </div>
          <div className="bg-fortress-steel/40 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Email verified</p>
            <Badge variant={user?.emailVerified ? 'success' : 'warning'}>
              {user?.emailVerified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
          <div className="bg-fortress-steel/40 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">KYC status</p>
            <Badge variant={user?.profile?.kycStatus === 'VERIFIED' ? 'success' : 'warning'}>
              {user?.profile?.kycStatus || 'NOT_SUBMITTED'}
            </Badge>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-fortress-border">
          <p className="text-xs text-slate-500">
            Account email: <span className="text-slate-300 font-medium">{user?.email}</span>
            &nbsp;·&nbsp; Role: <span className="text-slate-300 font-medium">{user?.role}</span>
          </p>
        </div>
      </Card>

      {/* Profile form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User size={18} className="text-fortress-accent" />
            <CardTitle>Personal information</CardTitle>
          </div>
          <CardDescription>Update your name, contact details, and address.</CardDescription>
        </CardHeader>

        {profileMsg && <Alert type={profileMsg.type} message={profileMsg.text} />}

        <form onSubmit={handleProfileSave} className="mt-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="firstName"
              label="First name"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              error={profileErrors.firstName}
              required
            />
            <Input
              id="lastName"
              label="Last name"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              error={profileErrors.lastName}
              required
            />
          </div>
          <Input
            id="phone"
            label="Phone number"
            type="tel"
            placeholder="+1 555 000 0000"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            error={profileErrors.phone}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="occupation"
              label="Occupation"
              placeholder="e.g. Software engineer"
              value={profile.occupation}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
            />
            <Input
              id="country"
              label="Country"
              placeholder="e.g. United States"
              value={profile.country}
              onChange={(e) => setProfile({ ...profile, country: e.target.value })}
            />
          </div>
          <Input
            id="address"
            label="Street address"
            placeholder="123 Main St"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="city"
              label="City"
              placeholder="New York"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            />
            <Input
              id="postalCode"
              label="Postal code"
              placeholder="10001"
              value={profile.postalCode}
              onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" loading={savingProfile}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Password change */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-fortress-accent" />
            <CardTitle>Change password</CardTitle>
          </div>
          <CardDescription>
            Use a strong password with uppercase, lowercase, numbers, and symbols.
          </CardDescription>
        </CardHeader>

        {passwordMsg && <Alert type={passwordMsg.type} message={passwordMsg.text} />}

        <form onSubmit={handlePasswordChange} className="mt-4 space-y-4 max-w-sm">
          <Input
            id="currentPassword"
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            error={passwordErrors.currentPassword}
            required
          />
          <Input
            id="newPassword"
            label="New password"
            type="password"
            autoComplete="new-password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            error={passwordErrors.newPassword}
            required
          />
          <Input
            id="confirmPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            error={passwordErrors.confirmPassword}
            required
          />
          <div className="pt-2">
            <Button type="submit" loading={savingPassword}>
              Change password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
