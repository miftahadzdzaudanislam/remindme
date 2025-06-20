<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;
    protected $table = "Logs";
    protected $fillable = ['user_id', 'activity', 'details', 'ip_address'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
