'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Label } from '../../components/ui/label'

const initialState = {
    error: '',
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Restricted Access</CardTitle>
                    <CardDescription>
                        Please enter the password to access the documentation.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter password"
                                required
                                className="w-full"
                            />
                        </div>
                        {state?.error && (
                            <p className="text-sm text-red-500 font-medium">{state.error}</p>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? 'Verifying...' : 'Access Documentation'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
